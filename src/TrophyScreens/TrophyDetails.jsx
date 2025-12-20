import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
// Importando ambos os thunks agora
import { toggleTrophyThunk, toggleAllTrophiesThunk } from "../app/thunks/trophyThunks";
import { TROPHIES } from "../data/trophiesData";
import "./TrophyDetails.css";

function TrophyDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const gameTrophies = useMemo(() => TROPHIES[id] || [], [id]);

  const completedStatus = useSelector((state) => state.trophies.completedTrophies[id] || {});

  const displayTrophies = useMemo(() => {
    const mapped = gameTrophies.map((trophy, index) => {
      const status = completedStatus[trophy.name];
      return {
        ...trophy,
        isCompleted: status?.isCompleted || false,
        originalIndex: status?.originalIndex ?? index,
      };
    });

    mapped.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted - b.isCompleted;
      }
      return a.originalIndex - b.originalIndex;
    });
    
    return mapped;
  }, [gameTrophies, completedStatus]);

  const toggleCompleted = (trophyName, originalIndex) => {
    dispatch(toggleTrophyThunk({ 
      gameId: id, 
      trophyName: trophyName,
      originalIndex: originalIndex
    }));
  };

  const areAllCompleted = useMemo(() => {
    if (gameTrophies.length === 0) return false;
    // Compara a quantidade de troféus do jogo com a quantidade marcada como true
    return gameTrophies.length === Object.values(completedStatus).filter(t => t.isCompleted).length;
  }, [completedStatus, gameTrophies]);

  // --- NOVA FUNÇÃO DE MARCAR TODOS ---
  const handleToggleAll = (event) => {
    // Se todos já estão marcados, queremos desmarcar (false). 
    // Se falta algum, queremos marcar tudo (true).
    const newState = !areAllCompleted;
    
    // Precisamos enviar a lista de nomes para o backend saber quais troféus existem nesse jogo
    const allTrophyNames = gameTrophies.map(t => t.name);

    dispatch(toggleAllTrophiesThunk({ 
      gameId: id, 
      allTrophies: allTrophyNames,
      markAll: newState
    }));
  };  

  return (
    <div className="container mt-5 pt-5">
      <div className="d-flex justify-content-center align-items-center mb-2">
        <h1 className="trophy-details-title text-center mb-0 me-3">
          {id.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
        </h1>
        
        {gameTrophies.length > 0 && ( 
          <div className="form-check mark-all-checkbox" title={areAllCompleted ? "Desmarcar Todos" : "Marcar Todos"}>
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="markAllSwitch"
              checked={areAllCompleted}
              onChange={handleToggleAll} 
            />
            <label className="form-check-label" htmlFor="markAllSwitch">
            </label>
          </div>
        )}

      </div> 
      <div className="trophy-details-line mb-4"></div>

      <div className="row">
        {displayTrophies.map((trophy, index) => (
          <div key={trophy.name} className="col-12 mb-3">
            <div className={`trophy-details-card shadow-sm ${trophy.isCompleted ? "completed-rose" : ""}`}>
              
              <div className="trophy-info">
                <p className="trophy-name mb-1">{trophy.name}</p>
                <p className="trophy-desc mb-0">{trophy.description}</p>
              </div>

              <button
                className={`trophy-btn ${trophy.isCompleted ? "completed" : ""}`}
                onClick={() => toggleCompleted(trophy.name, trophy.originalIndex)}
              >
                <i className={`bi ${trophy.isCompleted ? "bi-check-circle-fill" : "bi-check-circle"}`}></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrophyDetails;