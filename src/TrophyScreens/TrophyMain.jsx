import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TROPHIES, ALL_GAMES_INFO } from "../data/trophiesData";
import "./TrophyMain.css";

function TrophyMain() {
  const navigate = useNavigate();

  const trackedGameIds = useSelector((state) => state.trophies.trackedGameIds || []);
  
  const completedData = useSelector((state) => state.trophies.completedTrophies);

  const gamesToDisplay = trackedGameIds
    .map(id => {
        const gameInfo = ALL_GAMES_INFO[id]; 
        return gameInfo ? { id, ...gameInfo } : null; 
    })
    .filter(game => game !== null); 

  const calculateProgress = (gameId) => {
    const totalTrophies = TROPHIES[gameId]?.length || 0;
    const completedForGame = completedData[gameId] || {};
    const completedCount = Object.values(completedForGame).filter(trophy => trophy.isCompleted).length;
    if (totalTrophies === 0) return 0;
    return Math.round((completedCount / totalTrophies) * 100);
  };

  const goToAddGames = () => {
    navigate('/add-trophy-games'); 
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="trophy-main-header mb-4 d-flex justify-content-center align-items-center">
         <h1 className="trophy-main-title mb-2">Meus Troféus</h1>
         <button onClick={goToAddGames} className="trophy-main-icon-button ms-3" title="Adicionar jogo">
           <i className="bi bi-plus-circle text-danger"></i>
         </button>
         <Link to="/trophy-recommended" className="trophy-main-icon-button ms-2">
           <i className="bi bi-arrow-repeat text-danger"></i>
         </Link>
       </div>
       <div className="trophy-main-line"></div>

      <div className="row">
        {gamesToDisplay.length > 0 ? (
          gamesToDisplay.map((game) => {
            const progress = calculateProgress(game.id);
            return (
              <div className="col-6 col-md-4 col-lg-3 mb-4" key={game.id}>
                <Link to={`/trophy/${game.id}`} className="trophy-card">
                  <img src={game.image} alt={game.name} className="trophy-main-card-img" />

                  {progress === 100 && (
                    <div className="platinum-overlay" title="Platinado!">
                      <i className="bi bi-trophy-fill"></i>
                    </div>
                  )}

                  <div className="progress-container">
                    <div
                      className="progress-bar-custom"
                      style={{ width: `${progress}%` }}
                    >
                      <p>{progress}%</p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="col-12 text-center mt-5">
            <p>Você ainda não adicionou nenhum jogo para seguir.</p>
            <button onClick={goToAddGames} className="btn btn-danger">
              Adicionar Jogos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrophyMain;