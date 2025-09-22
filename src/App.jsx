import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Main/Main";
import Ranking from "./RankingScreens/RankingMain"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css"

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/main" element={<Main />} />
          <Route path="/ranking" element={<Ranking />} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;