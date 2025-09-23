import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Main/Main";
import Ranking from "./RankingScreens/RankingMain"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css"
import Trophy from "./TrophyScreens/TrophyMain"
import TrophyDetails from "./TrophyScreens/TrophyDetails";
import Biblioteca from "./pages/Biblioteca";
import Detalhes from "./pages/Biblioteca/detalhes";
import Login from "./pages/User/Login";
import Challenge from "./RankingScreens/Challenge"

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/main" element={<Main />} />
          <Route path="/trophy" element={<Trophy />} />
          <Route path="/trophy/:id" element={<TrophyDetails />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/biblioteca/detalhes/:id" element={<Detalhes />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/user/login" element={<Login />} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;