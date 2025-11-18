import Layout from './layout/Layout';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import GraphicDesign from './pages/GraphicDesign';
import Illustrations from './pages/Illustrations';
import All from './pages/All';
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
  const hideHeaderRoutes = new Set([
    "/category/graphic-design",
    "/category/illustrations",
    "/category/all",
  ]);
  const showHeader = !location.pathname.startsWith("/single") && !hideHeaderRoutes.has(location.pathname);

  return (
    <Layout
      header={showHeader ? <Header /> : null}
      footer={<Footer />}
      main={
        <>
          <HomeButton />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/graphic-design" element={<GraphicDesign />} />
            <Route path="/category/illustrations" element={<Illustrations />} />
            <Route path="/category/all" element={<All />} />
            <Route path="/single/:workId" element={<SinglePage />} />
          </Routes>
        </>
      }
    />
  );
};

export default App;
