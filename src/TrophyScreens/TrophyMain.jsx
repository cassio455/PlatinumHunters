import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProgress, fetchAvailableGamesThunk } from "../app/thunks/trophyThunks";
import "./TrophyMain.css";

function TrophyMain() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userProgress = useSelector((state) => state.trophies.userProgress || []);
  const availableGames = useSelector((state) => state.trophies.availableGames || []);

  useEffect(() => {
    dispatch(fetchUserProgress());
    if (availableGames.length === 0) {
      dispatch(fetchAvailableGamesThunk());
    }
  }, [dispatch, availableGames.length]);

  const goToAddGames = () => {
    navigate("/add-trophy-games");
  };

  const gamesToDisplay = userProgress
    .filter(p => p.isTracked)
    .map(progress => {
      const gameInfo = availableGames.find(g => g.id === progress.gameId);
      const completedCount = progress.completedTrophies ? progress.completedTrophies.length : 0;
      const totalTrophies = progress.total || 0;
      
      let percent = 0;
      if (totalTrophies > 0) {
        percent = Math.round((completedCount / totalTrophies) * 100);
      }

      return {
        id: progress.gameId,
        name: gameInfo ? (gameInfo.nome || gameInfo.name) : progress.gameId.replace(/-/g, ' '),
        image: gameInfo ? (gameInfo.backgroundimage || gameInfo.image) : "https://via.placeholder.com/300x400",
        percent: percent
      };
    });

  return (
    // Removi 'mt-4' e confio apenas na classe .trophy-main-container
    <div className="container trophy-main-container">
       <div className="d-flex justify-content-between align-items-center mb-3 header-container">
         <h2 className="text-white m-0">Meus Troféus</h2>
         <Link to="/add-trophy-games">
           <button className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
             <i className="bi bi-plus-lg"></i>
           </button>
         </Link>
       </div>
       <div className="trophy-main-line"></div>

      <div className="row">
        {gamesToDisplay.length > 0 ? (
          gamesToDisplay.map((game) => (
            <div className="col-6 col-md-4 col-lg-3 mb-4" key={game.id}>
              <Link to={`/trophy/${game.id}`} className="trophy-card shadow-lg">
                <img src={game.image} alt={game.name} className="trophy-main-card-img" />

                {game.percent === 100 && (
                  <div className="platinum-overlay" title="Platinado!">
                    <i className="bi bi-trophy-fill"></i>
                  </div>
                )}

                <div className="progress-container">
                  <div
                    className="progress-bar-custom"
                    style={{ width: `${game.percent}%` }}
                  >
                    <p>{game.percent}%</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-12 text-center mt-5">
            <p className="text-secondary fs-5">Você ainda não adicionou nenhum jogo para seguir.</p>
            <button onClick={goToAddGames} className="btn btn-danger px-4 py-2">
              Adicionar Jogos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrophyMain;