import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Main/Main";
import Ranking from "./RankingScreens/RankingMain"
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
          <Route path="/" element={<Main />} />
          <Route path="/main" element={<Main />} />
          <Route path="/trophy" element={<Trophy />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/biblioteca/detalhes/:id" element={<Detalhes />} />
          <Route path="/ranking" element={<Ranking />} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;