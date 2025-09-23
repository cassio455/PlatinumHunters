import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Main/Main";
import Ranking from "./RankingScreens/RankingMain"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css"
import Trophy from "./TrophyScreens/TrophyMain"
import Challenge from "./RankingScreens/Challenge"

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/main" element={<Main />} />
          <Route path="/trophy" element={<Trophy />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/challenge" element={<Challenge />} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;