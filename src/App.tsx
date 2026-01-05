import Layout from './layout/Layout';
import Header from './components/Header';
import ShopHeader from './components/ShopHeader';
import Footer from './components/Footer';
import Home from './pages/Home';
import GraphicDesign from './pages/GraphicDesign';
import Illustrations from './pages/Illustrations';
import All from './pages/All';
import GiftArt from './pages/GiftArt';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Products from './pages/Products';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import './App.css';
import SinglePage from './pages/single';
import PrivacyAndPolicy from './pages/Privacy&policy';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

const AppContent = () => {
  const location = useLocation();
  // Usa ShopHeader solo per la pagina /products
  const isShop = location.pathname === "/products";
  return (
    <Layout
      header={isShop ? <ShopHeader /> : <Header />}
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
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/privacyandpolicy" element={<PrivacyAndPolicy />} />
          </Routes>
        </>
      }
    />
  );
};

export default App;
