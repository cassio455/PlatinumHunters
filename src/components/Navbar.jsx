import { Link } from "react-router-dom";
import "./Navbar.css"

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg fixed-top w-100">
      <div className="container">
        <Link className="navbar-brand mb-0 h1" to="/main" style={{color: "white"}}>
          Platinum Hunters
        </Link>

        {/* Toggler for small screens */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu" aria-controls="navbarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarMenu">

        {/* Search Bar */}
        <form className="d-flex mt-2 mt-lg-0 w-100 w-lg-auto">
          <input className="form-control me-2" type="search" placeholder="Pesquisar" />
          <button className="btn search-btn" type="submit">
              <i className="bi bi-search"></i>
          </button>
        </form>

          {/* Links on the right */}
          <ul className="navbar-nav mx-auto flex-column flex-lg-row text-center">
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/biblioteca">Biblioteca</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/screen2">Jogos</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/trophy">Troféus</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/screen2">Guias</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/screen2">Ranking</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;