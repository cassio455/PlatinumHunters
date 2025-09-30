import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { User } from "lucide-react";
import "./Navbar.css"

function Navbar() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const handleUserIconClick = () => {
    if (isAuthenticated) {
      navigate('/user/profile');
    } else {
      navigate('/user/login');
    }
  };
  
  return (
    <nav className="navbar navbar-expand-lg fixed-top w-100">
      <div className="container">
        <NavLink className="navbar-brand mb-0 h1" to="/main" style={{color: "white"}}>
          Platinum Hunters
        </NavLink>

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
              <NavLink className="nav-link" to="/biblioteca">Biblioteca</NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink className="nav-link" to="/screen2">Jogos</NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink className="nav-link" to="/trophy">Troféus</NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink className="nav-link" to="/screen4">Guias</NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink className="nav-link" to="/ranking">Ranking</NavLink>
            </li>
            <li className="nav-item mx-2 user-mobile-center">
              <div className="nav-link user-icon-mobile-center" style={{cursor: 'pointer'}} onClick={handleUserIconClick}>
                <User size={22} style={{ verticalAlign: 'middle' }}/>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
