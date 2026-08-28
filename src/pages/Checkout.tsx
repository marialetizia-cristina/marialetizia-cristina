import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { processCheckout } from "../api/storeApi";
import { DynamicForm, type FormFieldConfig, type FormValue, type FormValues } from "../components/form";
import { useCartStore } from "../store/useCartStore";
import "../style/Checkout.css";
import { usePageMeta } from "../utils/usePageMeta";

const valueOf = (value: FormValue) => typeof value === "string" ? value : "";

const Checkout = () => {
  const { t } = useTranslation();
  const { cart, loading, error: cartError, loadCart } = useCartStore();
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  usePageMeta(t("checkout.title"), t("checkout.digitalOnly"), "/checkout", true);

  useEffect(() => { if (!cart) void loadCart(); }, [cart, loadCart]);

  const fields = useMemo<FormFieldConfig[]>(() => {
    const result: FormFieldConfig[] = [
      { type: "text", name: "first_name", label: t("checkout.firstName"), required: true, autoComplete: "given-name" },
      { type: "text", name: "last_name", label: t("checkout.lastName"), required: true, autoComplete: "family-name" },
      { type: "email", name: "email", label: t("checkout.email"), required: true, autoComplete: "email" },
      { type: "tel", name: "phone", label: t("checkout.phone"), required: true, autoComplete: "tel" },
      { type: "text", name: "country", label: t("checkout.country"), required: true, autoComplete: "country" },
    ];
    if (cart?.needs_shipping) {
      result.splice(4, 0,
        { type: "text", name: "address_1", label: t("checkout.address"), required: true, autoComplete: "street-address" },
        { type: "text", name: "city", label: t("checkout.city"), required: true, autoComplete: "address-level2" },
        { type: "text", name: "state", label: t("checkout.state"), autoComplete: "address-level1" },
        { type: "text", name: "postcode", label: t("checkout.postcode"), required: true, autoComplete: "postal-code" },
      );
    }
    if (cart?.needs_payment) {
      result.push({
        type: "radio", name: "payment_method", label: t("checkout.paymentMethod"), required: true,
        options: cart.payment_methods.map((method) => ({ label: method.toLowerCase().includes("paypal") ? "PayPal" : method, value: method })),
      });
    }
    result.push({ type: "textarea", name: "customer_note", label: t("checkout.notes"), rows: 3 });
    return result;
  }, [cart, t]);

  const submit = async (values: FormValues) => {
    setError(null);
    const address = {
      first_name: valueOf(values.first_name), last_name: valueOf(values.last_name), email: valueOf(values.email), phone: valueOf(values.phone),
      address_1: valueOf(values.address_1), city: valueOf(values.city), state: valueOf(values.state), postcode: valueOf(values.postcode), country: valueOf(values.country).toUpperCase(),
    };
    try {
      const response = await processCheckout({
        billing_address: address,
        shipping_address: cart?.needs_shipping ? address : { ...address, email: undefined },
        payment_method: cart?.needs_payment ? valueOf(values.payment_method) : "",
        payment_data: [],
        customer_note: valueOf(values.customer_note),
      });
      if (response.payment_result?.redirect_url) {
        window.location.assign(response.payment_result.redirect_url);
        return;
      }
      setOrderNumber(response.order_id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t("checkout.error"));
    }
  };

  if (loading && !cart) return <p className="checkout-page__state">{t("cart.loading")}</p>;
  if (cartError && !cart) return <p className="checkout-page__state" role="alert">{cartError}</p>;
  if (!cart || cart.items.length === 0) return <section className="checkout-page"><h1>{t("checkout.title")}</h1><p>{t("cart.empty")}</p><Link to="/products">{t("cart.continueShopping")}</Link></section>;
  if (orderNumber) return <section className="checkout-page"><h1>{t("checkout.success")}</h1><p>{t("checkout.orderNumber", { number: orderNumber })}</p></section>;

  const hasPaymentMethod = !cart.needs_payment || cart.payment_methods.length > 0;

  return (
    <section className="checkout-page">
      <Link to="/cart">← {t("checkout.backToCart")}</Link>
      <h1>{t("checkout.title")}</h1>
      <p>{cart.needs_shipping ? t("checkout.shippingRequired") : t("checkout.digitalOnly")}</p>
      <p className="checkout-page__terms">
        {t("checkout.termsNotice")} <Link to="/terms-and-conditions">{t("checkout.termsLink")}</Link>
      </p>
      {error && <p className="checkout-page__error" role="alert">{error}</p>}
      {!hasPaymentMethod ? (
        <div className="checkout-page__error" role="alert">
          <h2>{t("checkout.noPaymentTitle")}</h2>
          <p>{t("checkout.noPaymentBody")}</p>
        </div>
      ) : (
        <DynamicForm fields={fields} onSubmit={submit} submitLabel={t("checkout.placeOrder")} submittingLabel={t("checkout.processing")} />
      )}
    </section>
  );
};

export default Checkout;
