import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import "../style/ProductDetail.css";
import { useTranslation } from "react-i18next";

interface ProductImage {
  src: string;
  alt?: string;
}

interface ProductDownload {
  id: string;
  name: string;
  file: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  images: ProductImage[];
  downloads?: ProductDownload[];
  permalink: string;
}

const ProductDetail = () => {
  const { t } = useTranslation();
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const addToCart = useCartStore(state => state.addToCart);
  const items = useCartStore(state => state.items);

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
      } catch (e) {
        setError(e instanceof Error ? e.message : t('product.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, t]);

<<<<<<< HEAD
  if (loading) return <div className="product-detail-container"><div className="loading">{t('product.loading')}</div></div>;
  if (error) return <div className="product-detail-container"><div className="error">{t('product.error')}: {error}</div></div>;
  if (!product) return <div className="product-detail-container"><div className="error">{t('product.notFound')}</div></div>;

  // Check if product is in cart
=======

  if (loading) return <div>Caricamento prodotto...</div>;
  if (error) return <div>Errore: {error}</div>;
  if (!product) return <div>Prodotto non trovato.</div>;

  // Simula "acquisto" locale: se il prodotto è nel carrello, mostra download, altrimenti solo anteprima
>>>>>>> 7fc0db0 (feat: add ShopHeader component and update routing for products page; refactor GiftArt to redirect to products)
  const isInCart = items.some(item => item.id === product.id);

  // Se il prodotto ha download digitali
  const hasDownload = Array.isArray(product.downloads) && product.downloads.length > 0;
  const download = hasDownload && product.downloads ? product.downloads[0] : null;

  return (
    <div className="product-detail-container">
      <Link to="/products" className="back-link">← {t('product.backToProducts')}</Link>
      <h1 className="product-title">{product.name}</h1>
      {product.images && product.images[0] && (
        <img 
          src={product.images[0].src} 
          alt={product.images[0].alt || product.name} 
          className="product-main-image"
        />
      )}
      <div className="product-description" dangerouslySetInnerHTML={{ __html: product.description }} />
      <div className="product-price">€ {product.price}</div>

      {/* Se è un prodotto digitale, mostra anteprima e download se acquistato */}
      {hasDownload && download && (
        <div className="digital-file-section">
          <h3>{t('product.digitalPreview')}</h3>
          <img
            src={download.file}
            alt={download.name || t('product.previewAlt')}
            className={`preview-image ${isInCart ? 'unlocked' : 'locked'}`}
            draggable={false}
            onContextMenu={e => !isInCart && e.preventDefault()}
          />
          {!isInCart && <div className="preview-notice">{t('product.purchaseToUnlock')}</div>}
          {isInCart && (
            <a
              href={download.file}
              download
              className="download-button"
            >
              {t('product.downloadFile')}
            </a>
          )}
        </div>
      )}

      {/* Bottone acquista/aggiungi al carrello */}
      <button
        className="add-to-cart-button"
        onClick={() => addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images && product.images[0]?.src,
          permalink: product.permalink
        })}
        disabled={isInCart}
      >
        {isInCart ? t('product.addedToCart') : t('product.addToCart')}
      </button>
    </div>
  );
};

export default ProductDetail;
