import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const consumerKey = import.meta.env.VITE_WC_KEY;
        const consumerSecret = import.meta.env.VITE_WC_SECRET;
        const res = await fetch(`https://marialetizia.netsons.org/wp-json/wc/v3/products/${productId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`);
        if (!res.ok) throw new Error("Errore nel recupero prodotto");
        const data = await res.json();
        setProduct(data);
      } catch (e: any) {
        setError(e.message || "Errore generico");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <div>Caricamento prodotto...</div>;
  if (error) return <div>Errore: {error}</div>;
  if (!product) return <div>Prodotto non trovato.</div>;

  // Simula "acquisto" locale: se il prodotto è nel carrello, mostra download, altrimenti solo anteprima
  const isInCart = useCartStore(state => state.items.some(item => item.id === product.id));

  // Se il prodotto ha download digitali
  const hasDownload = Array.isArray(product.downloads) && product.downloads.length > 0;
  const download = hasDownload ? product.downloads[0] : null;

  return (
    <div style={{ padding: 24 }}>
      <Link to="/products" style={{ marginBottom: 16, display: 'inline-block' }}>← Torna ai prodotti</Link>
      <h1>{product.name}</h1>
      {product.images && product.images[0] && (
        <img src={product.images[0].src} alt={product.images[0].alt || product.name} style={{ width: 400, maxWidth: '100%', borderRadius: 8, marginBottom: 24 }} />
      )}
      <div dangerouslySetInnerHTML={{ __html: product.description }} />
      <div style={{ fontWeight: 'bold', margin: '16px 0' }}>€ {product.price}</div>

      {/* Se è un prodotto digitale, mostra anteprima e download se acquistato */}
      {hasDownload && (
        <div style={{ margin: '24px 0' }}>
          <h3>Anteprima file digitale</h3>
          <img
            src={download.file}
            alt={download.name || 'Anteprima'}
            style={{
              width: 500,
              maxWidth: '100%',
              borderRadius: 8,
              marginBottom: 12,
              pointerEvents: 'none',
              userSelect: 'none',
              filter: isInCart ? 'none' : 'blur(2px) grayscale(0.3)',
              opacity: isInCart ? 1 : 0.7
            }}
            draggable={false}
            onContextMenu={e => !isInCart && e.preventDefault()}
          />
          {!isInCart && <div style={{ color: '#888', fontSize: 14 }}>Acquista per sbloccare il download</div>}
          {isInCart && (
            <a
              href={download.file}
              download
              style={{
                display: 'inline-block',
                marginTop: 12,
                color: '#fff',
                background: '#0070f3',
                border: 'none',
                borderRadius: 4,
                padding: '8px 16px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Download file
            </a>
          )}
        </div>
      )}

      {/* Bottone acquista/aggiungi al carrello */}
      <button
        style={{ color: "#0070f3", background: 'none', border: '1px solid #0070f3', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', marginTop: 8 }}
        onClick={() => addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images && product.images[0]?.src,
          permalink: product.permalink
        })}
        disabled={isInCart}
      >
        {isInCart ? 'Aggiunto al carrello' : 'Aggiungi al carrello'}
      </button>
    </div>
  );
};

export default ProductDetail;
