import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store';
import Main from "./Main/Main";
import AuthSync from "./app/AuthSync";
import Ranking from "./RankingScreens/RankingMain";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";
import Trophy from "./TrophyScreens/TrophyMain";
import TrophyRecommended from "./TrophyScreens/TrophyRecommended";
import TrophyDetails from "./TrophyScreens/TrophyDetails";
import AddTrophyGames from "./TrophyScreens/AddTrophyGames";
import Biblioteca from "./pages/Biblioteca";
import Detalhes from "./pages/Biblioteca/detalhes";
import Login from "./pages/User/Login";
import Challenge from "./RankingScreens/Challenge";
import Jogos from "./pages/Jogos/Jogos";
import SignUp from "./pages/User/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/User/Profile";
import Shop from "./RankingScreens/Shop";

import CriarGuia from "./pages/Guias/CriarGuia/CriarGuia";
import ListaGuias from "./pages/Guias/ListaGuias/ListaGuias";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AuthSync />
          <Navbar />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/main" element={<Main />} />
            <Route path="/trophy" element={<Trophy />} />
            <Route path="/trophy/:id" element={<TrophyDetails />} />
            <Route path="/trophy-recommended" element={<TrophyRecommended />} />
            <Route path="/add-trophy-games" element={<AddTrophyGames />} />
            <Route
              path="/biblioteca"
              element={
                <ProtectedRoute>
                  <Biblioteca />
                </ProtectedRoute>
              }
            />
            <Route path="/biblioteca/detalhes/:id" element={<Detalhes />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/jogos" element={<Jogos />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/signup" element={<SignUp />} />
            <Route
              path="/user/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* Novas rotas de guias */}
            <Route path="/guias" element={<ListaGuias />} />
            <Route path="/guias/criar" element={<CriarGuia />} />
          </Routes>
          <Footer />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
