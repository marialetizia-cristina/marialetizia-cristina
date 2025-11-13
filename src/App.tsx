import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Illustrations from "./pages/GraphicDesign";
import All from "./pages/All";
import GraphicDesign from "./pages/GraphicDesign";
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/graphic-designer" element={<GraphicDesign />} />
          <Route path="/category/illustrations" element={<Illustrations />} />
          <Route path="/category/all" element={<All />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}
export default App;

// Utilizzo
/* function App() {
  return (
    <Layout
      header={<Header />}
      sidebar={<Sidebar />}
      main={<MainContent />}
      footer={<Footer />}
    />
  )
} */