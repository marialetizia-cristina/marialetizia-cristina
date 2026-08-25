import Layout from './layout/Layout';
import Header from './components/Header';
// import ShopHeader from './components/ShopHeader';
import Footer from './components/Footer';
import Home from './pages/Home';
import GraphicDesign from './pages/GraphicDesign';
import Illustrations from './pages/Illustrations';
import All from './pages/All';
import GiftArt from './pages/GiftArt';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from './pages/Products';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import EcommerceUnderConstruction from './pages/EcommerceUnderConstruction';
import './App.css';
import SinglePage from './pages/single';
import PrivacyAndPolicy from './pages/Privacy&policy';
import { ECOMMERCE_ENABLED } from './config/features';
import CustomGiftRequest from './pages/CustomGiftRequest';
import ProductQuoteRequest from './pages/ProductQuoteRequest';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import ShopPlaceholder from './pages/ShopPlaceholder';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

const AppContent = () => {
  // const location = useLocation();
  // Usa sempre Header, ShopHeader commentato temporaneamente
  // const isShop = location.pathname === "/products";
  return (
    <Layout
      header={<Header />}
      footer={<Footer />}
      main={
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/graphic-design" element={<GraphicDesign />} />
            <Route path="/category/illustrations" element={<Illustrations />} />
            <Route path="/category/gift-art" element={<GiftArt />} />
            <Route path="/category/all" element={<All />} />
            <Route path="/single/:workId" element={<SinglePage />} />
            <Route path="/products" element={ECOMMERCE_ENABLED ? <Products /> : <EcommerceUnderConstruction />} />
            <Route path="/products/:productId" element={ECOMMERCE_ENABLED ? <ProductDetail /> : <EcommerceUnderConstruction />} />
            <Route path="/products/:productId/request" element={<ProductQuoteRequest />} />
            <Route path="/cart" element={ECOMMERCE_ENABLED ? <Cart /> : <EcommerceUnderConstruction />} />
            <Route path="/checkout" element={ECOMMERCE_ENABLED ? <Checkout /> : <EcommerceUnderConstruction />} />
            <Route path="/account" element={<ShopPlaceholder section="account" />} />
            <Route path="/favorites" element={<ShopPlaceholder section="favorites" />} />
            <Route path="/request/custom-gift" element={<CustomGiftRequest />} />
            <Route path="/privacyandpolicy" element={<PrivacyAndPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      }
    />
  );
};

export default App;
