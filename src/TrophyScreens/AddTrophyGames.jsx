import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { trackGameThunk, fetchAvailableGamesThunk, fetchUserProgress } from '../app/thunks/trophyThunks';
import './AddTrophyGames.css';

function AddTrophyGames() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const availableGames = useSelector((state) => state.trophies.availableGames || []);
  const userProgress = useSelector((state) => state.trophies.userProgress || []);
  
  const trackedGameIds = userProgress
    .filter(p => p.isTracked)
    .map(p => p.gameId);

  useEffect(() => {
    dispatch(fetchAvailableGamesThunk());
    dispatch(fetchUserProgress());
  }, [dispatch]);

  const filteredGames = availableGames
    .filter(game => {
      const name = game.name || game.nome || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = a.name || a.nome || "";
      const nameB = b.name || b.nome || "";
      return nameA.localeCompare(nameB);
    });

  const handleToggleTrack = async (gameId, shouldTrack) => {
    await dispatch(trackGameThunk({ gameId, isTracked: shouldTrack }));
    dispatch(fetchUserProgress()); 
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container add-trophy-container">
      
      {/* Título */}
      <div className="text-center mb-4">
        <h2 className="text-white m-0">Adicionar Jogos</h2>
      </div>

      {/* Barra de Pesquisa + Botão Voltar na MESMA LINHA */}
      <div className="search-bar-container d-flex align-items-center gap-3 mb-4">
        <button 
            className="btn btn-back-small" 
            onClick={() => navigate(-1)}
            title="Voltar"
        >
          <i className="bi bi-arrow-left"></i>
        </button>

        <input 
          type="text"
          className="form-control search-input flex-grow-1"
          placeholder="Buscar jogo..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="add-games-line mb-4"></div>

      <div className="row">
        {filteredGames.map((game) => { 
          const isTracked = trackedGameIds.includes(game.id);
          const gameImage = game.image || game.backgroundimage || game.backgroundImage;
          const gameName = game.name || game.nome;

          return (
            <div key={game.id} className="col-6 col-md-4 col-lg-3 mb-4"> 
              <div className={`add-game-card ${isTracked ? 'tracked' : ''}`}>
                <img src={gameImage} alt={gameName} className="add-game-img" />
                <p className="add-game-name-overlay">{gameName}</p>
                <button
                  className={`btn btn-sm ${isTracked ? 'btn-danger' : 'btn-success'} add-game-button`}
                  onClick={() => handleToggleTrack(game.id, !isTracked)} 
                >
                  {isTracked ? <i className="bi bi-dash-circle"></i> : <i className="bi bi-plus-circle"></i>}
                </button>
              </div>
            </div>
          );
        })}
        {filteredGames.length === 0 && searchTerm && (
          <div className="col-12 text-center text-white mt-5">
             <p>Nenhum jogo encontrado com esse nome.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddTrophyGames;