import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
    completeChallengeAPI, 
    fetchChallengesList, 
    fetchRankingList,
    saveChallengeAPI, 
    deleteChallengeAPI 
} from "../app/thunks/rankingThunks"; 
import { fetchUserProgress } from "../app/thunks/trophyThunks";

import { Modal, Form, Button } from 'react-bootstrap';
import { Pencil, Trash2 } from 'lucide-react'; 
import "./Challenge.css";

function Challenge() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const monthlyChallenges = useSelector((state) => state.ranking.challenges || []);
  const allUsersRanking = useSelector((state) => state.ranking.list || []);
  
  // Pegando o estado correto do slice (userProgress é um Array)
  const userProgress = useSelector((state) => state.trophies.userProgress || []);

  const rankingPoints = user?.rankingPoints || 0;
  const completedChallengesIDs = user?.completedChallenges || [];
  
  const [selectedDay, setSelectedDay] = useState(new Date().getDate()); 
  const today = new Date().getDate();
  const selectedChallenge = monthlyChallenges.find(ch => ch.day === selectedDay);
  
  const isChallengeCompleted = isAuthenticated && completedChallengesIDs.includes(selectedDay) && !!selectedChallenge;
  
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ day: 1, title: '', points: 50 });
  const isAdmin = isAuthenticated && user?.roles?.includes('ADMIN');

  const processingChallengesRef = useRef(new Set());

  useEffect(() => {
    dispatch(fetchChallengesList());
    dispatch(fetchRankingList());
    if (isAuthenticated) {
        dispatch(fetchUserProgress());
    }
  }, [dispatch, isAuthenticated]);

  // --- DEBUG DE JOGOS (IMPORTANTE) ---
  // Abra o console (F12) para ver isso e corrigir o seed se necessário
  useEffect(() => {
      if (userProgress.length > 0) {
          console.log("🔍 MEUS JOGOS NO REDUX (Use estes IDs no seed):", 
            userProgress.map(p => ({ 
                id_correto: p.gameId, 
                total_trofeus: p.completedTrophies?.length 
            }))
          );
      }
  }, [userProgress]);

  // --- LÓGICA DE CONTAGEM E VERIFICAÇÃO ---

  const userTrophiesMap = useMemo(() => {
      const map = {};
      userProgress.forEach(game => {
          if (game.gameId) {
              map[game.gameId] = game.completedTrophies || [];
          }
      });
      return map;
  }, [userProgress]);

  const getUserTrophyCount = () => {
      return userProgress.reduce((total, game) => {
          return total + (game.completedTrophies ? game.completedTrophies.length : 0);
      }, 0);
  };

  const checkRequirements = (challenge = selectedChallenge) => {
      if (!challenge) return false;

      // TIPO 1: GENÉRICO (CONTAR TOTAL)
      if (challenge.type === 'COUNT') {
          const target = challenge.targetCount || 1;
          const current = getUserTrophyCount();
          return current >= target;
      }

      // TIPO 2: ESPECÍFICO (JOGO OU TROFÉU)
      if (challenge.requiredTrophy) {
          const { gameId, trophyName, trophyId, anyTrophy } = challenge.requiredTrophy;
          
          const userGameTrophies = userTrophiesMap[gameId]; 

          // Se não tem o jogo ou zero troféus nele, falha
          if (!userGameTrophies || userGameTrophies.length === 0) return false;

          // NOVO: MODO QUALQUER TROFÉU
          // Se o desafio aceita qualquer troféu e o usuário tem > 0 troféus (verificado acima), sucesso!
          if (anyTrophy) {
              return true;
          }

          // Busca Específica (ID ou Nome)
          const hasTrophy = userGameTrophies.some(t => {
              if (typeof t === 'object' && t !== null) {
                  // Prioridade: Comparar ID
                  if (trophyId && t.trophyId) {
                      return String(t.trophyId) === String(trophyId);
                  }
                  // Fallback: Comparar Nome
                  return t.trophyName === trophyName || t.name === trophyName;
              }
              return String(t) === trophyName;
          });

          return hasTrophy;
      }

      return true;
  };

  // --- AUTOMAÇÃO ---
  useEffect(() => {
    if (!isAuthenticated || monthlyChallenges.length === 0) return;

    monthlyChallenges.forEach(challenge => {
        if (completedChallengesIDs.includes(challenge.day)) return;
        if (processingChallengesRef.current.has(challenge.day)) return;

        if (checkRequirements(challenge)) {
            console.log(`🏆 Autocompletando desafio do dia ${challenge.day}...`);
            processingChallengesRef.current.add(challenge.day);

            dispatch(completeChallengeAPI({ 
                day: challenge.day, 
                points: challenge.points 
            }))
            .unwrap()
            .then(() => dispatch(fetchRankingList()))
            .catch((err) => processingChallengesRef.current.delete(challenge.day));
        }
    });
  }, [monthlyChallenges, userTrophiesMap, completedChallengesIDs, isAuthenticated, dispatch]); 

  const canComplete = isAuthenticated && 
                      !isChallengeCompleted && 
                      checkRequirements();

  const handleCompleteChallenge = async () => {
    if (!canComplete) return; 
    try {
        await dispatch(completeChallengeAPI({ 
            day: selectedDay, 
            points: selectedChallenge.points 
        })).unwrap();
        dispatch(fetchRankingList());
    } catch (err) {
        console.error('Erro ao completar desafio:', err);
        alert("Erro ao completar desafio.");
    }
  };

  const handleOpenModal = () => {
    setModalData({
        day: selectedDay,
        title: selectedChallenge?.title || '',
        points: selectedChallenge?.points || 50
    });
    setShowModal(true);
  };

  const handleSave = async () => {
      if (!modalData.title || modalData.points <= 0) return alert("Preencha título e pontos válidos.");
      await dispatch(saveChallengeAPI(modalData));
      setShowModal(false);
      setSelectedDay(modalData.day);
  };

  const handleDelete = async () => {
      if(confirm(`Excluir desafio do dia ${modalData.day}?`)) {
          await dispatch(deleteChallengeAPI(modalData.day));
          setShowModal(false);
      }
  };

  let progressPercent = 0;
  let currentCount = 0;
  let targetCount = 0;

  if (selectedChallenge?.type === 'COUNT') {
      currentCount = getUserTrophyCount();
      targetCount = selectedChallenge.targetCount || 1;
      progressPercent = Math.min(100, Math.floor((currentCount / targetCount) * 100));
  }

  const usersWhoCompleted = allUsersRanking.filter(u => 
    u.completedChallenges && u.completedChallenges.includes(selectedDay)
  );

  return (
    <div className="container mt-3 pt-5 text-center">
      
      {/* --- CABEÇALHO MODIFICADO --- */}
      <div className="page-header-container">
        <h2 className="title-text m-0">Desafios</h2>
        
        <Link to="/ranking" className="nav-corner-btn">
          Ir para Ranking <i className="bi bi-trophy ms-1"></i>
        </Link>
      </div>
      {/* ----------------------------- */}

      <div className="mb-3">
        {isAuthenticated ? (
          <span style={{ color: '#fa5f69', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {user?.username}, seus pontos: {rankingPoints}
          </span>
        ) : (
          <span style={{ color: '#ccc', fontSize: '1.2rem' }}>
            Faça login para gerenciar e completar!
          </span>
        )}
      </div>

      {/* ... (O resto do componente, challenge-divider-line etc, continua IGUAL) ... */}
      <div className="challenge-divider-line"></div>

      <Link to="/shop" className="floating-shop" aria-label="Abrir Loja">
        <i className="bi bi-shop"></i>
      </Link>

      <div className="calendar mb-4">
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
          const challenge = monthlyChallenges.find(ch => ch.day === day);
          const isFuture = day > today; 
          const hasChallenge = !!challenge;
          const isDone = isAuthenticated && completedChallengesIDs.includes(day) && hasChallenge;
          
          return (
            <div
              key={day}
              className={`calendar-day 
                          ${day === selectedDay ? "selected" : ""} 
                          ${isFuture ? "future-day" : ""} 
                          ${hasChallenge ? "has-challenge" : "no-challenge"}`}
              onClick={() => setSelectedDay(day)}
              style={isDone ? { background: '#4CAF50', color: 'white', fontWeight: 'bold' } : {}}
            >
              {isDone ? '✓' : day}
            </div>
          );
        })}
      </div>

      <div className="challenge-card p-4 mb-4 container position-relative">
        {isAdmin && (
          <button 
            className="btn btn-sm position-absolute top-0 end-0 m-3 text-white"
            onClick={handleOpenModal}
            title={selectedChallenge ? "Editar Desafio" : "Criar Desafio"}
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
              <Pencil size={16} /> {selectedChallenge ? "Editar" : "Criar"}
          </button>
        )}

      {selectedChallenge ? (
          <>
            <h4>{selectedChallenge.title}</h4>
            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
                {selectedChallenge.points} pontos
            </p>
            
            {selectedChallenge.type === 'COUNT' && (
                <div className="mb-3 px-4">
                    <div className="progress-container-challenge">
                        <div className="progress-text">
                            {currentCount} / {targetCount} Troféus ({progressPercent}%)
                        </div>
                        <div 
                            className="progress-bar-challenge" 
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {selectedChallenge.requiredTrophy && selectedChallenge.type !== 'COUNT' && !checkRequirements() && !isChallengeCompleted ? (
                 <div className="alert alert-warning">
                    <small>Requer troféu: <strong>{selectedChallenge.requiredTrophy.trophyName}</strong></small>
                 </div>
            ) : null}

            <button 
                className={`btn ${canComplete ? 'btn-outline-pink' : 'btn-secondary'}`}
                onClick={handleCompleteChallenge}
                disabled={!canComplete}
                style={
                   !canComplete
                    ? { opacity: 0.7, cursor: 'not-allowed' }
                    : { cursor: 'pointer' }
                }
            >
                {isChallengeCompleted ? "✓ Completado" : 
                 (selectedChallenge.type === 'COUNT' && !checkRequirements()) ? "Troféus Insuficientes" :
                 (selectedChallenge.requiredTrophy && !checkRequirements()) ? "Troféu Bloqueado" : 
                 "Completar Desafio"}
            </button>

            {usersWhoCompleted.length > 0 && (
                <div className="mt-4 pt-3 border-top border-secondary">
                    <p className="text-secondary small mb-2">Completado por:</p>
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                        {usersWhoCompleted.map(u => (
                            <img 
                                key={u.id}
                                src={u.avatar} 
                                alt={u.name}
                                title={`${u.name} completou!`}
                                className="rounded-circle border border-secondary"
                                style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                            />
                        ))}
                    </div>
                </div>
            )}
          </>
      ) : (
          <div className="text-secondary py-4">
              <h5>Nenhum desafio para este dia.</h5>
              {isAdmin && <p>Clique em "Criar" no canto superior para adicionar um.</p>}
          </div>
      )}

      {isChallengeCompleted && isAuthenticated && (
        <p style={{ color: '#4CAF50', marginTop: '15px', fontWeight: 'bold' }}>
          ✓ Você já completou este desafio!
        </p>
      )}
    </div>

    <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
            <Modal.Title>{selectedChallenge ? "Editar Desafio" : "Novo Desafio"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Dia</Form.Label>
                    <Form.Control 
                        type="number" 
                        value={modalData.day} 
                        onChange={(e) => setModalData({...modalData, day: parseInt(e.target.value)})}
                        min={1} max={31}
                        className="bg-dark text-white border-secondary" 
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Título</Form.Label>
                    <Form.Control 
                        type="text" value={modalData.title} 
                        onChange={(e) => setModalData({...modalData, title: e.target.value})}
                        className="bg-dark text-white border-secondary" placeholder="Ex: Matar 5 chefes"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Pontos</Form.Label>
                    <Form.Control 
                        type="number" value={modalData.points} 
                        onChange={(e) => setModalData({...modalData, points: parseInt(e.target.value)})}
                        className="bg-dark text-white border-secondary"
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer className="border-secondary d-flex justify-content-between">
            {selectedChallenge && (
                <Button variant="outline-danger" onClick={handleDelete}><Trash2 size={16}/> Excluir</Button>
            )}
            <Button variant="primary" onClick={handleSave} style={{ backgroundColor: '#fa5f69', borderColor: '#fa5f69', marginLeft: 'auto' }}>
                Salvar
            </Button>
        </Modal.Footer>
    </Modal>
    </div>
  );
}

export default Challenge;