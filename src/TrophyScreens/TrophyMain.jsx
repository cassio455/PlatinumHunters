import { Link } from "react-router-dom";
import "./TrophyMain.css";

function TrophyMain() {
  const games = [
    {
      id: "hollow-knight",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co93cr.jpg",
      progress: 70,
      unlocked: 14,
      total: 20,
    },
    {
      id: "silksong",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co3vtl.jpg",
      progress: 45,
      unlocked: 9,
      total: 20,
    },
    {
      id: "expedition-33",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co9gam.jpg",
      progress: 100,
      unlocked: 20,
      total: 20,
    },
    { 
      id: "peak", 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coa1i1.jpg",
      progress: 70, 
      unlocked: 14, 
      total: 20 
    },
    { 
      id: "metal-gear-snake-eater", 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coac1n.jpg", 
      progress: 45, 
      unlocked: 9, 
      total: 20 
    },
    { 
      id: "donkey-kong-bananza", 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coa082.jpg", 
      progress: 100, 
      unlocked: 20, 
      total: 20 
    },
    { 
      id: "elden-ring", 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg", 
      progress: 30, 
      unlocked: 6, 
      total: 20
    },
    { 
      id: "skyrim", 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tnw.jpg", 
      progress: 80, 
      unlocked: 16, 
      total: 20 
    },
    { 
      id: "god-of-war-2018", 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpeg", 
      progress: 55, 
      unlocked: 11, 
      total: 20 
    },
    { 
      id: "red-dead-redemption-2", 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpeg", 
      progress: 90, 
      unlocked: 18, 
      total: 20 
    },
    { 
      id: "the-last-of-us-remastered", 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5zks.jpeg", 
      progress: 25, 
      unlocked: 5, 
      total: 20 
    },
    { 
      id: "undertale", 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2855.jpeg", 
      progress: 60, 
      unlocked: 12, 
      total: 20 
    },
    { 
      id: "minecraft", 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co8fu7.jpeg", 
      progress: 75, 
      unlocked: 15, 
      total: 20 
    },
  ];

  return (
    <div className="container mt-5 pt-5">
      <div className="section-header mb-4">
        <h1 className="section-title text-center mb-2">Meus Troféus</h1>
        <div className="section-line"></div>
      </div>


      <div className="row">
        {games.map((game, index) => (
          <div className="col-6 col-md-4 col-lg-3 mb-4" key={game.id}>

            <Link to={`/trophy/${game.id}`} className="game-card">
              <div className="game-image-container">
                <img src={game.image} alt="Jogo" />

                <div className="card-img-overlay d-flex flex-column justify-content-end p-3">
                  <p className="card-text mb-1 hover-number">{game.unlocked}/{game.total}</p>
                  <div className="progress-container">
                    <div
                      className="progress-bar-custom"
                      style={{ width: `${game.progress}%` }}
                    >
                      <p>{game.progress}%</p>
                    </div>
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


