import { Link, useNavigate } from "react-router-dom";
import "./TrophyRecommended.css";

function TrophyRecommended() {
  const categories = [
    {
      title: "SoulsLike",
      games: [
        { id: "elden-ring", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg" },
        { id: "dark-souls", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x78.jpg" },
        { id: "dark-souls-2", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2eoo.jpg" },
        { id: "dark-souls-3", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1vcf.jpg" },
        { id: "sekiro", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2a23.jpg" },
        { id: "bloodborne", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rba.jpg" },
      ]
    },
    {
      title: "God Of War",
      games: [
        { id: "god-of-war-2018", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpeg" },
        { id: "god-of-war-ragnarok", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg" },
        { id: "god-of-war-ascension", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co3die.jpg" },
        { id: "god-of-war", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co3ddb.jpg" },
        { id: "god-of-war-II", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co3dik.jpg" },
        { id: "god-of-war-III", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co3koi.jpg" },
      ]
    },
    {
      title: "Resident Evil",
      games: [
        { id: "resident-evil", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2vz8.jpg" },
        { id: "resident-evil-2", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4t1w.jpg" },
        { id: "resident-evil-3", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2vvb.jpg" },
        { id: "resident-evil-4", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2wki.jpg" },
        { id: "resident-evil-5", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2vzi.jpg" },
        { id: "resident-evil-6", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co3pyq.jpg" },
      ]
    },
  ];

  return (
    <div className="container mt-5 pt-5">
      <div className="section-header mb-4 d-flex justify-content-center align-items-center">
        <h1 className="section-title mb-2">Platinas Recomendadas</h1>
        <Link to="/trophy-conquistados" className="swap-button ms-3">
          <i className="bi bi-arrow-repeat text-danger"></i>
        </Link>
      </div>

      {categories.map((cat) => (
        <div key={cat.title} className="mb-5">
          <h3 className="recommended-subtitle mb-3">{cat.title}</h3>
          <div className="section-line mb-3"></div>
          <div className="row">
            {cat.games.map((game) => (
              <div className="col-6 col-md-4 col-lg-2 mb-4" key={game.id}>
                <Link to={`/trophy/${game.id}`} className="game-card">
                  <div className="game-image-container">
                    <img src={game.image} alt={game.id} className="card-img" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrophyRecommended;