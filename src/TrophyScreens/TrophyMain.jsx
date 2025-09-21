import "./TrophyMain.css";

function TrophyMain() {
  const games = [
    {
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co93cr.jpg",
      progress: 70,
      unlocked: 14,
      total: 20,
    },
    {
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co3vtl.jpg",
      progress: 45,
      unlocked: 9,
      total: 20,
    },
    {
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co9gam.jpg",
      progress: 100,
      unlocked: 20,
      total: 20,
    },
    { 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coa1i1.jpg",
      progress: 70, 
      unlocked: 14, 
      total: 20 
    },
    { 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coac1n.jpg", 
      progress: 45, 
      unlocked: 9, 
      total: 20 
    },
    { 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coa082.jpg", 
      progress: 100, 
      unlocked: 20, 
      total: 20 
    },
    { 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg", 
      progress: 30, 
      unlocked: 6, 
      total: 20
    },
    { 
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tnw.jpg", 
      progress: 80, 
      unlocked: 16, 
      total: 20 
    },
    { image: "/images/jogo6.jpg", progress: 55, unlocked: 11, total: 20 },
    { image: "/images/jogo7.jpg", progress: 90, unlocked: 18, total: 20 },
    { image: "/images/jogo8.jpg", progress: 25, unlocked: 5, total: 20 },
    { image: "/images/jogo9.jpg", progress: 60, unlocked: 12, total: 20 },
    { image: "/images/jogo10.jpg", progress: 75, unlocked: 15, total: 20 },
  ];

  return (
    <div className="container mt-5 pt-5">
      <div className="section-header mb-4">
        <h1 className="section-title text-center mb-2">Meus Troféus</h1>
        <div className="section-line"></div>
      </div>


      <div className="row">
        {games.map((game, index) => (
          <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>

            <div className="game-card">
              <div className="game-image-container">
                <img src={game.image} alt="Jogo" />

                <div className="card-img-overlay d-flex flex-column justify-content-end p-3">
                  <p className="card-text mb-1 hover-number">{game.unlocked}/{game.total}</p>
                  <div className="progress-container">
                    <div
                      className="progress-bar-custom"
                      style={{ width: `${game.progress}%` }}
                    >
                      {game.progress}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrophyMain;


