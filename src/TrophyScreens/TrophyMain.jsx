import { Link, useNavigate } from "react-router-dom";
import "./TrophyMain.css";

function TrophyMain() {
  const navigate = useNavigate();

  const games = [
    { id: "hollow-knight", image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co93cr.jpg", progress: 70 },
    { id: "silksong", image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co3vtl.jpg", progress: 45 },
    { id: "expedition-33", image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co9gam.jpg", progress: 100 },
    { id: "peak", image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coa1i1.jpg", progress: 70 },
    { id: "metal-gear-snake-eater", image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coac1n.jpg", progress: 45 },
    { id: "donkey-kong-bananza", image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coa082.jpg", progress: 100 },
    { id: "elden-ring", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg", progress: 30 },
    { id: "skyrim", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tnw.jpg", progress: 80 },
    { id: "god-of-war-2018", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpeg", progress: 55 },
    { id: "red-dead-redemption-2", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpeg", progress: 90 },
    { id: "the-last-of-us-remastered", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5zks.jpeg", progress: 25 },
    { id: "undertale", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2855.jpeg", progress: 60 },
    { id: "minecraft", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co8fu7.jpeg", progress: 75 },
  ];

  return (
    <div className="container mt-5 pt-5">
      <div className="section-header mb-4 d-flex justify-content-center align-items-center">
        <h1 className="section-title mb-2">Meus Troféus</h1>
        <Link to="/trophy-recommended" className="swap-button ms-3">
          <i className="bi bi-arrow-repeat text-danger"></i>
        </Link>
      </div>

      <div className="section-line"></div>

      <div className="row">
        {games.map((game) => (
          <div className="col-6 col-md-4 col-lg-3 mb-4" key={game.id}>
            <Link to={`/trophy/${game.id}`} className="game-card">
              <div className="game-image-container">
                <img src={game.image} alt={game.id} className="card-img" />
                <div className="progress-container">
                  <div
                    className="progress-bar-custom"
                    style={{ width: `${game.progress}%` }}
                  >
                    <p>{game.progress}%</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrophyMain;