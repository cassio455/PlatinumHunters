import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Main/Main";
import Navbar from "./components/Navbar";
import "./App.css"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/main" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;