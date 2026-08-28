import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ApiError, fetchAttachmentConfig, fetchProduct, submitQuoteRequest, uploadAttachments, type AttachmentConfig, type CatalogProduct } from "../api/api";
import { DynamicForm, type FormErrors, type FormFieldConfig, type FormValue, type FormValues } from "../components/form";
import "../style/CustomGiftRequest.css";
import { usePageMeta } from "../utils/usePageMeta";

function asString(value: FormValue): string {
  return typeof value === "string" ? value : "";
}

const ProductQuoteRequest = () => {
  const { productId } = useParams();
  const location = useLocation();
  const returnPath = (location.state as { from?: string } | null)?.from ?? "/category/all";
  const { t } = useTranslation();
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [attachmentConfig, setAttachmentConfig] = useState<AttachmentConfig | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  usePageMeta(product ? t("request.quoteTitle", { product: product.name }) : t("product.loading"), t("request.quoteNotice"), `/products/${productId ?? ""}/request`, true);

  useEffect(() => {
    const id = Number(productId);
    if (!Number.isInteger(id) || id <= 0) {
      setError(t("product.notFound"));
      return;
    }
    fetchProduct(id)
      .then((result) => {
        if (result.flow !== "variable_quote") throw new Error(t("request.invalidQuoteProduct"));
        setProduct(result);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : t("product.loadError")));
  }, [productId, t]);
  useEffect(() => { fetchAttachmentConfig().then(setAttachmentConfig).catch(() => setAttachmentConfig(null)); }, []);

  const fields = useMemo<FormFieldConfig[]>(() => {
    const common: FormFieldConfig[] = [
      { type: "text", name: "name", label: t("request.fields.name"), required: true, autoComplete: "name" },
      {
        type: "email", name: "email", label: t("request.fields.email"), required: true, autoComplete: "email",
        validate: (value) => /^\S+@\S+\.\S+$/.test(asString(value)) ? undefined : t("request.errors.email"),
      },
      {
        type: "tel", name: "phone", label: t("request.fields.phone"), description: t("request.fields.optional"), autoComplete: "tel",
        validate: (value) => !asString(value) || /^[0-9+().\s-]{6,30}$/.test(asString(value)) ? undefined : t("request.errors.phone"),
      },
    ];
    if (product?.physical) {
      common.push(
        { type: "text", name: "delivery_address", label: t("request.fields.address"), required: true, autoComplete: "street-address" },
        { type: "text", name: "delivery_city", label: t("request.fields.city"), required: true, autoComplete: "address-level2" },
        { type: "text", name: "delivery_postcode", label: t("request.fields.postcode"), required: true, autoComplete: "postal-code" },
        { type: "text", name: "delivery_country", label: t("request.fields.country"), required: true, autoComplete: "country-name" },
      );
    }
    common.push(
      {
        type: "textarea", name: "description", label: t("request.fields.customization"), required: true, rows: 7, minLength: 20,
        description: t("request.fields.descriptionHelp"),
        validate: (value) => asString(value).trim().length >= 20 ? undefined : t("request.errors.description"),
      },
    );
    if (attachmentConfig?.enabled) common.push({
      type: "file", name: "attachments", label: t("request.fields.attachments"),
      description: t("request.fields.attachmentsConfiguredHelp", { count: attachmentConfig.max_files, mb: Math.floor(attachmentConfig.max_bytes / 1048576) }),
      accept: attachmentConfig.accepted_mime_types.join(","), multiple: attachmentConfig.max_files > 1,
    });
    common.push({ type: "checkbox", name: "privacy", label: t("request.fields.privacy"), checkboxLabel: t("request.fields.privacyConsent"), required: true });
    return common;
  }, [attachmentConfig, product?.physical, t]);

  const handleSubmit = async (values: FormValues) => {
    if (!product) return;
    setError(null);
    setFieldErrors({});
    try {
      const attachmentTokens = await uploadAttachments(values.attachments instanceof FileList ? values.attachments : null, attachmentConfig?.max_files);
      const response = await submitQuoteRequest({
        flow: "variable_quote",
        product_id: product.id,
        name: asString(values.name),
        email: asString(values.email),
        phone: asString(values.phone),
        description: asString(values.description),
        privacy_accepted: values.privacy === true,
        delivery: product.physical ? {
          address: asString(values.delivery_address), city: asString(values.delivery_city),
          postcode: asString(values.delivery_postcode), country: asString(values.delivery_country),
        } : undefined,
        website: "",
        attachment_tokens: attachmentTokens,
      });
      setReference(response.reference);
    } catch (reason) {
      if (reason instanceof ApiError) setFieldErrors(Object.fromEntries(Object.entries(reason.fields).map(([key, value]) => [key === "privacy_accepted" ? "privacy" : key.replace("delivery.", "delivery_"), value])));
      setError(reason instanceof Error ? reason.message : t("request.submitError"));
    }
  };

  if (!product && !error) return <p className="products-page__state">{t("product.loading")}</p>;
  if (!product) return <p className="products-page__state" role="alert">{error}</p>;

  return (
    <section className="custom-request-page">
      <div className="custom-request-page__header">
        <Link className="custom-request-page__back" to={returnPath}>← {t("request.backToProject")}</Link>
        <p className="custom-request-page__eyebrow">{t("request.variableFlowLabel")}</p>
        <h1>{t("request.quoteTitle", { product: product.name })}</h1>
        <p>{product.physical ? t("request.physicalDelivery") : t("request.digitalDelivery")}</p>
        <p className="custom-request-page__notice">{t("request.quoteNotice")}</p>
      </div>
      {reference ? (
        <div className="custom-request-page__success" role="status">
          <h2>{t("request.successTitle")}</h2>
          <p>{t("request.successBody", { reference })}</p>
        </div>
      ) : (
        <>
          {error && <p className="custom-request-page__error" role="alert">{error}</p>}
          <DynamicForm fields={fields} externalErrors={fieldErrors} onSubmit={handleSubmit} submitLabel={t("request.submit")} submittingLabel={t("request.submitting")} />
        </>
      )}
    </section>
  );
};

export default ProductQuoteRequest;
