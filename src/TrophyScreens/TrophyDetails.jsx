import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { 
  toggleTrophyThunk, 
  toggleAllTrophiesThunk,
  fetchGameTrophiesThunk, 
  createTrophyThunk,
  deleteTrophyThunk,
  editTrophyThunk
} from "../app/thunks/trophyThunks";

import "./TrophyDetails.css";

function TrophyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);
  const [newTrophy, setNewTrophy] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const allGameTrophies = useSelector((state) => state.trophies.gameTrophiesList || []);

  const completedStatus = useSelector((state) => state.trophies.completedTrophies[id] || {});

  useEffect(() => {
    dispatch(fetchGameTrophiesThunk(id));
  }, [dispatch, id]);

  const displayTrophies = useMemo(() => {
    const mapped = allGameTrophies.map((trophy, index) => {
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
  }, [allGameTrophies, completedStatus]);

  const toggleCompleted = (trophyName) => {
    dispatch(toggleTrophyThunk({ gameId: id, trophyName, originalIndex: 0 }));
  };

  const areAllCompleted = useMemo(() => {
    if (allGameTrophies.length === 0) return false;
    const completedNames = Object.keys(completedStatus).filter(k => completedStatus[k].isCompleted);
    const validCompleted = completedNames.filter(name => allGameTrophies.some(t => t.name === name));
    return allGameTrophies.length === validCompleted.length;
  }, [completedStatus, allGameTrophies]);

  const handleToggleAll = () => {
    const newState = !areAllCompleted;
    const allTrophyNames = allGameTrophies.map(t => t.name);
    dispatch(toggleAllTrophiesThunk({ gameId: id, allTrophies: allTrophyNames, markAll: newState }));
  };

  const handleEditClick = (trophy) => {
    setNewTrophy({ name: trophy.name, description: trophy.description });
    setEditingId(trophy._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setNewTrophy({ name: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTrophy.name || !newTrophy.description) return;

    if (editingId) {
        dispatch(editTrophyThunk({
            id: editingId,
            data: { name: newTrophy.name, description: newTrophy.description }
        })).then(() => {
            resetForm();
            dispatch(fetchGameTrophiesThunk(id));
        });
    } else {
        dispatch(createTrophyThunk({
            gameId: id,
            name: newTrophy.name,
            description: newTrophy.description,
            difficulty: "bronze",
            isCustom: true
        })).then(() => {
            resetForm();
            dispatch(fetchGameTrophiesThunk(id));
        });
    }
  };

  const handleDelete = (trophyId) => {
    if(window.confirm("Tem certeza que deseja deletar este troféu criado?")) {
        dispatch(deleteTrophyThunk(trophyId));
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row mb-3">
        <div className="col-12 text-start">
            <button className="btn btn-back-custom" onClick={() => navigate(-1)} title="Voltar">
                <i className="bi bi-arrow-left"></i>
            </button>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center mb-2">
        <h1 className="trophy-details-title text-center mb-0 me-3">
          {id.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
        </h1>
        {allGameTrophies.length > 0 && ( 
          <div className="form-check mark-all-checkbox" title={areAllCompleted ? "Desmarcar Todos" : "Marcar Todos"}>
            <input className="form-check-input" type="checkbox" id="markAllSwitch" checked={areAllCompleted} onChange={handleToggleAll} />
            <label className="form-check-label" htmlFor="markAllSwitch"></label>
          </div>
        )}
      </div> 
      <div className="trophy-details-line mb-4"></div>

      <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8 text-center">
              {!showForm && (
                <button className="btn btn-main-custom mb-3" onClick={() => { resetForm(); setShowForm(true); }}>
                    + Adicionar Novo Troféu
                </button>
              )}
              {showForm && (
                  <div className="card p-4 shadow-sm text-start trophy-form-card">
                      <h5 className="mb-3">{editingId ? "Editar Troféu" : "Criar Novo Troféu"}</h5>
                      <form onSubmit={handleSubmit}>
                          <div className="mb-3">
                              <label className="form-label">Nome</label>
                              <input type="text" className="form-control form-control-custom" value={newTrophy.name} onChange={e => setNewTrophy({...newTrophy, name: e.target.value})} required />
                          </div>
                          <div className="mb-3">
                              <label className="form-label">Descrição</label>
                              <textarea className="form-control form-control-custom" rows="2" value={newTrophy.description} onChange={e => setNewTrophy({...newTrophy, description: e.target.value})} required />
                          </div>
                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-main-custom flex-grow-1">{editingId ? "Atualizar" : "Salvar"}</button>
                            <button type="button" className="btn btn-dark-custom" onClick={resetForm}>Cancelar</button>
                          </div>
                      </form>
                  </div>
              )}
          </div>
      </div>

      <div className="row">
        {displayTrophies.map((trophy) => (
          <div key={trophy._id || trophy.name} className="col-12 mb-3">
            <div className={`trophy-details-card shadow-sm ${trophy.isCompleted ? "completed-rose" : ""}`}>
              
              <div className="trophy-info">
                  <p className="trophy-name">{trophy.name}</p>
                  <p className="trophy-desc">{trophy.description}</p>
              </div>

              <div className="d-flex align-items-center">
                  {trophy.isCustom && (
                      <div className="me-3 d-flex align-items-center">
                          <button className="btn btn-sm btn-edit-custom me-2" onClick={(e) => { e.stopPropagation(); handleEditClick(trophy); }} title="Editar">
                              <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button className="btn btn-sm text-danger" onClick={(e) => { e.stopPropagation(); handleDelete(trophy._id); }} title="Deletar">
                              <i className="bi bi-trash-fill"></i>
                          </button>
                      </div>
                  )}

                  <button className={`trophy-btn ${trophy.isCompleted ? "completed" : ""}`} onClick={() => toggleCompleted(trophy.name)}>
                    <i className={`bi ${trophy.isCompleted ? "bi-check-circle-fill" : "bi-check-circle"}`}></i>
                  </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrophyDetails;