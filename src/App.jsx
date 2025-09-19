import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Main/Main";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css"

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/main" element={<Main />} />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;