import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { 
  toggleTrophyThunk, 
  toggleAllTrophiesThunk,
  fetchGameTrophiesThunk, 
  createTrophyThunk,
  deleteTrophyThunk,
  editTrophyThunk,
  fetchAvailableGamesThunk,
  fetchUserProgress
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
  const availableGames = useSelector((state) => state.trophies.availableGames || []);
  const userProgress = useSelector((state) => state.trophies.userProgress || []);

  const gameInfo = useMemo(() => 
    availableGames.find(g => g.id === id), 
  [availableGames, id]);

  const myProgress = useMemo(() => 
    userProgress.find(p => p.gameId === id), 
  [userProgress, id]);

  const completedIds = myProgress ? myProgress.completedTrophies : [];

  useEffect(() => {
    dispatch(fetchGameTrophiesThunk(id));
    if (availableGames.length === 0) dispatch(fetchAvailableGamesThunk());
    if (userProgress.length === 0) dispatch(fetchUserProgress());
  }, [dispatch, id]);

  const displayTrophies = useMemo(() => {
    if (!allGameTrophies) return [];
    return allGameTrophies.map((trophy) => ({
      ...trophy,
      isCompleted: completedIds.includes(trophy._id)
    }));
  }, [allGameTrophies, completedIds]);

  const toggleCompleted = (trophyId) => {
    dispatch(toggleTrophyThunk({ gameId: id, trophyName: trophyId }));
  };

  const areAllCompleted = useMemo(() => {
    return displayTrophies.length > 0 && displayTrophies.every(t => t.isCompleted);
  }, [displayTrophies]);

  const handleToggleAll = () => {
    const newState = !areAllCompleted;
    const allTrophyIds = displayTrophies.map(t => t._id);
    dispatch(toggleAllTrophiesThunk({ gameId: id, allTrophies: allTrophyIds, markAll: newState }));
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
        dispatch(editTrophyThunk({ id: editingId, data: newTrophy })).then(() => resetForm());
    } else {
        dispatch(createTrophyThunk({ gameId: id, ...newTrophy, difficulty: "bronze" })).then(() => resetForm());
    }
  };

  const handleDelete = (trophyId) => {
    if(window.confirm("Deseja deletar este troféu?")) {
        dispatch(deleteTrophyThunk(trophyId));
    }
  };

  return (
    // APLIQUEI A NOVA CLASSE AQUI
    <div className="container trophy-details-container">
      <div className="row mb-2 align-items-center">
        <div className="col-2">
            <button className="btn btn-back-custom" onClick={() => navigate(-1)} title="Voltar">
                <i className="bi bi-arrow-left"></i>
            </button>
        </div>
        <div className="col-8 text-center d-flex justify-content-center align-items-center gap-3">
            <h1 className="trophy-details-title mb-0">
            {gameInfo ? (gameInfo.nome || gameInfo.name) : id.replace(/-/g, ' ')}
            </h1>
            {displayTrophies.length > 0 && ( 
            <div className="form-check mark-all-checkbox m-0" title="Marcar todos">
                <input className="form-check-input" type="checkbox" id="markAllSwitch" checked={areAllCompleted} onChange={handleToggleAll} />
            </div>
            )}
        </div>
        <div className="col-2"></div> {/* Espaçador para centralizar o titulo */}
      </div>

      <div className="trophy-details-line mb-4"></div>

      {/* Formulário */}
      <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8 text-center">
              {!showForm && (
                <button className="btn btn-main-custom mb-3 shadow-sm" onClick={() => setShowForm(true)}>
                    <i className="bi bi-plus-circle me-2"></i> Adicionar Novo Troféu
                </button>
              )}
              {showForm && (
                  <div className="card p-4 shadow-sm text-start trophy-form-card animate__animated animate__fadeIn">
                      <h5 className="mb-3 text-white">{editingId ? "Editar Troféu" : "Criar Novo Troféu"}</h5>
                      <form onSubmit={handleSubmit}>
                          <div className="mb-3">
                              <label className="form-label text-secondary">Nome</label>
                              <input type="text" className="form-control form-control-custom" value={newTrophy.name} onChange={e => setNewTrophy({...newTrophy, name: e.target.value})} required />
                          </div>
                          <div className="mb-3">
                              <label className="form-label text-secondary">Descrição</label>
                              <textarea className="form-control form-control-custom" rows="2" value={newTrophy.description} onChange={e => setNewTrophy({...newTrophy, description: e.target.value})} required />
                          </div>
                          <div className="d-flex gap-2 justify-content-end">
                            <button type="button" className="btn btn-dark-custom" onClick={resetForm}>Cancelar</button>
                            <button type="submit" className="btn btn-main-custom px-4">{editingId ? "Atualizar" : "Salvar"}</button>
                          </div>
                      </form>
                  </div>
              )}
          </div>
      </div>

      {/* Lista de Troféus */}
      <div className="row">
        {displayTrophies.length > 0 ? (
          displayTrophies.map((trophy) => (
            <div key={trophy._id} className="col-12 mb-3">
              <div className={`trophy-details-card shadow-sm ${trophy.isCompleted ? "completed-rose" : ""}`}>
                <div className="trophy-info ps-2">
                    <p className="trophy-name">{trophy.name}</p>
                    <p className="trophy-desc">{trophy.description}</p>
                </div>
                <div className="d-flex align-items-center">
                    {trophy.isCustom && (
                        <div className="me-3 d-flex align-items-center border-end pe-3 border-secondary">
                            <button className="btn btn-sm btn-edit-custom me-2" onClick={() => { setEditingId(trophy._id); setNewTrophy({name: trophy.name, description: trophy.description}); setShowForm(true); }}>
                                <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button className="btn btn-sm text-secondary hover-danger" onClick={() => handleDelete(trophy._id)}>
                                <i className="bi bi-trash-fill"></i>
                            </button>
                        </div>
                    )}
                    <button className={`trophy-btn ${trophy.isCompleted ? "completed" : ""}`} onClick={() => toggleCompleted(trophy._id)} title={trophy.isCompleted ? "Desmarcar" : "Completar"}>
                      <i className={`bi ${trophy.isCompleted ? "bi-check-circle-fill" : "bi-circle"}`}></i>
                    </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-secondary mt-5 pt-5">
            <i className="bi bi-trophy display-1 mb-3 d-block opacity-25"></i>
            <p className="fs-5">Nenhum troféu encontrado para este jogo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrophyDetails;