import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Main/Main";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css"
import Trophy from "./TrophyScreens/TrophyMain"
import Biblioteca from "./pages/Biblioteca";
import Detalhes from "./pages/Biblioteca/detalhes";

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/main" element={<Main />} />
          <Route path="/trophy" element={<Trophy />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/biblioteca/detalhes/:id" element={<Detalhes />} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;