import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// CORREÇÃO: Usando apenas "../" pois a pasta App está apenas um nível acima
import { trackGameThunk } from '../app/thunks/trophyThunks';
// CORREÇÃO: Usando apenas "../" para a pasta Data também
import { TROPHIES, ALL_GAMES_INFO } from '../data/trophiesData';
import './AddTrophyGames.css';

function AddTrophyGames() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const trackedGameIds = useSelector((state) => state.trophies.trackedGameIds || []);

  const allAvailableGames = Object.keys(TROPHIES)
    .map(id => {
        const gameInfo = ALL_GAMES_INFO[id];
        return gameInfo ? { id, ...gameInfo } : null; 
    })
    .filter(game => game !== null)
    .sort((a,b) => a.name.localeCompare(b.name));

  const filteredGames = allAvailableGames.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleTrack = (gameId, shouldTrack) => {
    dispatch(trackGameThunk({ gameId, isTracked: shouldTrack }));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="add-games-title mb-0">Adicionar/Remover Jogos</h1>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/trophy')}>
           Voltar para Meus Troféus
        </button>
      </div>

      <div className="mb-4 search-bar-container">
        <input 
          type="text"
          className="form-control search-input"
          placeholder="Buscar jogo..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="add-games-line mb-4"></div>

      <div className="row">
        {filteredGames.map((game) => { 
          const isTracked = trackedGameIds.includes(game.id);
          return (
            <div key={game.id} className="col-6 col-md-4 col-lg-3 mb-4"> 
              <div className={`add-game-card ${isTracked ? 'tracked' : ''}`}>
                <img src={game.image} alt={game.name} className="add-game-img" />
                <p className="add-game-name-overlay">{game.name}</p>
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
          <div className="col-12 text-center mt-4">
            <p>Nenhum jogo encontrado para "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddTrophyGames;