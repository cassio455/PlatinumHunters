import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Main/Main";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css"
import Trophy from "./TrophyScreens/TrophyMain"
import TrophyDetails from "./TrophyScreens/TrophyDetails";

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/main" element={<Main />} />
          <Route path="/trophy" element={<Trophy />} />
          <Route path="/trophy/:id" element={<TrophyDetails />} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;