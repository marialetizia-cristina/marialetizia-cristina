import Layout from './layout/Layout';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import GraphicDesign from './pages/GraphicDesign';
import Illustrations from './pages/Illustrations';
import All from './pages/All';
import GiftArt from './pages/GiftArt';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import SinglePage from './pages/single';
import HomeButton from './components/HomeButton';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

const AppContent = () => {
  const location = useLocation();
  const isSingleRoute = location.pathname.startsWith("/single");
  const showHomeButton = isSingleRoute;

  return (
    <Layout
      header={<Header />}
      footer={<Footer />}
      main={
        <>
          {showHomeButton ? <HomeButton /> : null}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/graphic-design" element={<GraphicDesign />} />
            <Route path="/category/illustrations" element={<Illustrations />} />
            <Route path="/category/gift-art" element={<GiftArt />} />
            <Route path="/category/all" element={<All />} />
            <Route path="/single/:workId" element={<SinglePage />} />
          </Routes>
        </>
      }
    />
  );
};

export default App;
