import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";
//import SwitchLang from "../components/SwitchLang";

interface Product {
  id: number;
  name: string;
  price: string;
  images: { src: string; alt?: string }[];
  permalink: string;
  description: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addToCart = useCartStore(state => state.addToCart);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const consumerKey = import.meta.env.VITE_WC_KEY;
        const consumerSecret = import.meta.env.VITE_WC_SECRET;
        const res = await fetch(`https://marialetizia.netsons.org/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`);
        if (!res.ok) throw new Error("Errore nel recupero prodotti");
        const data = await res.json();
        const mapped = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          images: (item.images || []).map((img: any) => ({ src: img.src, alt: img.alt })),
          permalink: item.permalink,
          description: item.description,
        }));
        setProducts(mapped);
      } catch (e: any) {
        setError(e.message || "Errore generico");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Caricamento prodotti...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Prodotti digitali</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, width: 300, cursor: 'pointer' }}
            onClick={e => {
              // Evita che il click sul bottone aggiunga anche la navigazione
              if ((e.target as HTMLElement).tagName === 'BUTTON') return;
              navigate(`/products/${product.id}`);
            }}
          >
            {product.images[0] && (
              <img src={product.images[0].src} alt={product.images[0].alt || product.name} style={{ width: "100%", height: 200, objectFit: "cover" }} />
            )}
            <h2>{product.name}</h2>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
            <div style={{ fontWeight: "bold", margin: "8px 0" }}>€ {product.price}</div>
            <button
              style={{ color: "#0070f3", background: 'none', border: '1px solid #0070f3', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', marginTop: 8 }}
              onClick={e => {
                e.stopPropagation();
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0]?.src,
                  permalink: product.permalink
                });
              }}
            >
              Aggiungi al carrello
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
