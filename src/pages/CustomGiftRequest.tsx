import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ApiError, fetchAttachmentConfig, submitQuoteRequest, uploadAttachments, type AttachmentConfig } from "../api/api";
import {
  DynamicForm,
  type FormFieldConfig,
  type FormValues,
  type FormValue,
  type FormErrors,
} from "../components/form";
import "../style/CustomGiftRequest.css";
import { usePageMeta } from "../utils/usePageMeta";
import { todayForDateInput } from "../utils/date";

function stringValue(value: FormValue): string {
  return typeof value === "string" ? value : "";
}

const CustomGiftRequest = () => {
  const { t } = useTranslation();
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);
  const [reference, setReference] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attachmentConfig, setAttachmentConfig] = useState<AttachmentConfig | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  usePageMeta(t("request.pageTitle"), t("request.pageDescription"), "/request/custom-gift");

  useEffect(() => { fetchAttachmentConfig().then(setAttachmentConfig).catch(() => setAttachmentConfig(null)); }, []);

  const fields = useMemo<FormFieldConfig[]>(() => [
    {
      type: "text",
      name: "name",
      label: t("request.fields.name"),
      required: true,
      autoComplete: "name",
    },
    {
      type: "email",
      name: "email",
      label: t("request.fields.email"),
      required: true,
      autoComplete: "email",
      validate: (value) => /^\S+@\S+\.\S+$/.test(stringValue(value))
        ? undefined
        : t("request.errors.email"),
    },
    {
      type: "tel",
      name: "phone",
      label: t("request.fields.phone"),
      description: t("request.fields.optional"),
      autoComplete: "tel",
      validate: (value) => {
        const phone = stringValue(value);
        if (phone === "") return undefined;
        return /^[0-9+().\s-]{6,30}$/.test(phone) ? undefined : t("request.errors.phone");
      },
    },
    {
      type: "radio",
      name: "fulfillment",
      label: t("request.fields.fulfillment"),
      required: true,
      options: [
        { label: t("request.fields.digital"), value: "digital" },
        { label: t("request.fields.physical"), value: "physical" },
      ],
    },
    {
      type: "text",
      name: "delivery_address",
      label: t("request.fields.address"),
      required: true,
      autoComplete: "street-address",
      isVisible: (values) => values.fulfillment === "physical",
    },
    {
      type: "text",
      name: "delivery_city",
      label: t("request.fields.city"),
      required: true,
      autoComplete: "address-level2",
      isVisible: (values) => values.fulfillment === "physical",
    },
    {
      type: "text",
      name: "delivery_postcode",
      label: t("request.fields.postcode"),
      required: true,
      autoComplete: "postal-code",
      isVisible: (values) => values.fulfillment === "physical",
    },
    {
      type: "text",
      name: "delivery_country",
      label: t("request.fields.country"),
      required: true,
      autoComplete: "country-name",
      isVisible: (values) => values.fulfillment === "physical",
    },
    {
      type: "textarea",
      name: "description",
      label: t("request.fields.description"),
      placeholder: t("request.fields.descriptionPlaceholder"),
      description: t("request.fields.descriptionHelp"),
      required: true,
      minLength: 20,
      rows: 7,
      validate: (value) => stringValue(value).trim().length >= 20
        ? undefined
        : t("request.errors.description"),
    },
    {
      type: "date",
      name: "desired_delivery_date",
      label: t("request.fields.desiredDeliveryDate"),
      description: t("request.fields.desiredDeliveryDateHelp"),
      required: true,
      min: todayForDateInput(),
    },
    ...(attachmentConfig?.enabled ? [{
      type: "file" as const,
      name: "attachments",
      label: t("request.fields.attachments"),
      description: t("request.fields.attachmentsConfiguredHelp", { count: attachmentConfig.max_files, mb: Math.floor(attachmentConfig.max_bytes / 1048576) }),
      accept: attachmentConfig.accepted_mime_types.join(","),
      multiple: attachmentConfig.max_files > 1,
    }] : []),
    {
      type: "checkbox",
      name: "privacy",
      label: t("request.fields.privacy"),
      checkboxLabel: t("request.fields.privacyConsent"),
      required: true,
    },
  ], [attachmentConfig, t]);

  const handleSubmit = async (values: FormValues) => {
    setSubmitError(null);
    setFieldErrors({});
    try {
      const fulfillment = stringValue(values.fulfillment) === "physical" ? "physical" : "digital";
      const attachmentTokens = await uploadAttachments(values.attachments instanceof FileList ? values.attachments : null, attachmentConfig?.max_files);
      const response = await submitQuoteRequest({
        flow: "gift_request",
        name: stringValue(values.name),
        email: stringValue(values.email),
        phone: stringValue(values.phone),
        description: stringValue(values.description),
        desired_delivery_date: stringValue(values.desired_delivery_date),
        privacy_accepted: values.privacy === true,
        fulfillment,
        delivery: fulfillment === "physical" ? {
          address: stringValue(values.delivery_address),
          city: stringValue(values.delivery_city),
          postcode: stringValue(values.delivery_postcode),
          country: stringValue(values.delivery_country),
        } : undefined,
        website: "",
        attachment_tokens: attachmentTokens,
      });
      setReference(response.reference);
      setSubmittedValues(values);
    } catch (reason) {
      if (reason instanceof ApiError) {
        setFieldErrors(Object.fromEntries(Object.entries(reason.fields).map(([key, value]) => [key === "privacy_accepted" ? "privacy" : key.replace("delivery.", "delivery_"), value])));
      }
      setSubmitError(reason instanceof Error ? reason.message : t("request.submitError"));
    }
  };

  return (
    <section className="custom-request-page">
      <div className="custom-request-page__header">
        <Link className="custom-request-page__back" to="/idee-regalo/">
          ← {t("request.back")}
        </Link>
        <p className="custom-request-page__eyebrow">{t("request.flowLabel")}</p>
        <h1>{t("request.pageTitle")}</h1>
        <p>{t("request.pageDescription")}</p>
        <p className="custom-request-page__notice">{t("request.quoteNotice")}</p>
      </div>

      {submittedValues ? (
        <div className="custom-request-page__success" role="status">
          <h2>{t("request.simulationTitle")}</h2>
          <p>{t("request.successBody", { reference })}</p>
          <button type="button" onClick={() => setSubmittedValues(null)}>
            {t("request.newRequest")}
          </button>
        </div>
      ) : (
        <>
          {submitError && <p className="custom-request-page__error" role="alert">{submitError}</p>}
          <DynamicForm
            className="custom-request-page__form"
            fields={fields}
            submitLabel={t("request.submit")}
            submittingLabel={t("request.submitting")}
            onSubmit={handleSubmit}
            externalErrors={fieldErrors}
          />
        </>
      )}
    </section>
  );
};

export default CustomGiftRequest;
