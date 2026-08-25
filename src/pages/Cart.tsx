import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/useCartStore";
import "../style/Cart.css";
import { usePageMeta } from "../utils/usePageMeta";
import { formatStoreMoney } from "../utils/money";

const Cart = () => {
  const { t } = useTranslation();
  const { cart, loading, error, loadCart, removeFromCart, updateQuantity } = useCartStore();
  usePageMeta(t("cart.title"), t("cart.empty"), "/cart", true);

  useEffect(() => { void loadCart(); }, [loadCart]);

  if (loading && !cart) return <p className="cart-page__state">{t("cart.loading")}</p>;
  if (error && !cart) return <p className="cart-page__state" role="alert">{error}</p>;
  if (!cart || cart.items.length === 0) return <section className="cart-page"><h1>{t("cart.title")}</h1><p>{t("cart.empty")}</p><Link to="/products">{t("cart.continueShopping")}</Link></section>;

  return (
    <section className="cart-page">
      <h1>{t("cart.title")}</h1>
      {error && <p role="alert">{error}</p>}
      <ul className="cart-list">
        {cart.items.map((item) => (
          <li className="cart-item" key={item.key}>
            {item.images[0] && <img src={item.images[0].src} alt={item.images[0].alt || item.name} />}
            <div className="cart-item__content">
              <h2>{item.name}</h2>
              {item.item_data.map((data) => <p key={`${data.key}-${data.value}`}><strong>{data.key}:</strong> {data.value}</p>)}
              <label>
                {t("cart.quantity")}
                <span className="cart-item__quantity">
                  <button type="button" disabled={loading || item.quantity <= 1} onClick={() => void updateQuantity(item.key, item.quantity - 1)} aria-label={t("cart.decreaseQuantity", { product: item.name })}>−</button>
                  <output aria-live="polite">{item.quantity}</output>
                  <button type="button" disabled={loading} onClick={() => void updateQuantity(item.key, item.quantity + 1)} aria-label={t("cart.increaseQuantity", { product: item.name })}>+</button>
                </span>
              </label>
              <p>{formatStoreMoney(item.totals.line_total, item.totals)}</p>
            </div>
            <button className="cart-item__remove" type="button" disabled={loading} onClick={() => void removeFromCart(item.key)}>{t("cart.remove")}</button>
          </li>
        ))}
      </ul>
      <div className="cart-page__summary">
        <p><strong>{t("cart.total")}:</strong> {formatStoreMoney(cart.totals.total_price, cart.totals)}</p>
        <Link className="cart-page__checkout" to="/checkout">{t("cart.checkout")}</Link>
      </div>
    </section>
  );
};

export default Cart;
