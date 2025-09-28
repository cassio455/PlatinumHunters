import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Main/Main";
import AuthSync from "./app/AuthSync";
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
import SignUp from "./pages/User/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/User/Profile";

function App() {
  return (
    <Router>
      <AuthSync />
      <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/main" element={<Main />} />
          <Route path="/trophy" element={<Trophy />} />
          <Route path="/trophy/:id" element={<TrophyDetails />} />
          <Route path="/biblioteca" element={
            <ProtectedRoute>
              <Biblioteca />
              </ProtectedRoute>} />
          <Route path="/biblioteca/detalhes/:id" element={<Detalhes />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/signup" element={<SignUp />} />
          <Route path="/user/profile" element={
            <ProtectedRoute>
              <Profile />
              </ProtectedRoute>} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;