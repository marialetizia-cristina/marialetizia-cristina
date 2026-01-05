import { useCartStore } from "../store/useCartStore";

const Cart = () => {
  const { items, removeFromCart, clearCart } = useCartStore();

  const total = items.reduce((sum, p) => sum + parseFloat(p.price) * p.quantity, 0);

  if (items.length === 0) {
    return <div style={{ padding: 24 }}><h1>Carrello</h1><p>Il carrello è vuoto.</p></div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Carrello</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
          <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            {item.image && <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 16, borderRadius: 4 }} />}
            <div style={{ flex: 1 }}>
              <div><strong>{item.name}</strong></div>
              <div>Quantità: {item.quantity}</div>
              <div>Prezzo: € {item.price}</div>
            </div>
            <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: 16 }}>Rimuovi</button>
          </li>
        ))}
      </ul>
      <div style={{ fontWeight: 'bold', margin: '16px 0' }}>Totale: € {total.toFixed(2)}</div>
      <button onClick={clearCart}>Svuota carrello</button>
    </div>
  );
};

export default Cart;
