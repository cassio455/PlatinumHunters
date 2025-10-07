import { Link, useNavigate } from "react-router-dom";
import "./TrophyConquistados.css";

function TrophyConquistados() {
  return (
    <div className="container mt-5 pt-5">
      <div className="section-header mb-4 d-flex justify-content-center align-items-center">
        <h1 className="section-title mb-2">Troféus Conquistados</h1>
        <Link to="/trophy" className="swap-button ms-3">
          <i className="bi bi-arrow-repeat text-danger"></i>
        </Link>
      </div>

      <div className="section-line"></div>

      
    </div>
  );
}

export default TrophyConquistados;