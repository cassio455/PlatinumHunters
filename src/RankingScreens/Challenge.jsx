import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
    completeChallengeAPI, 
    fetchChallengesList, 
    fetchRankingList,
    saveChallengeAPI, 
    deleteChallengeAPI 
} from "../app/thunks/rankingThunks"; 
import { Modal, Form, Button } from 'react-bootstrap';
import { Pencil, Trash2 } from 'lucide-react'; 
import "./Challenge.css";

function Challenge() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const monthlyChallenges = useSelector((state) => state.ranking.challenges || []);
  const allUsersRanking = useSelector((state) => state.ranking.list || []);
  const rankingPoints = user?.rankingPoints || 0;
  const completedChallengesIDs = user?.completedChallenges || [];
  const [selectedDay, setSelectedDay] = useState(new Date().getDate()); 
  const today = new Date().getDate();
  const selectedChallenge = monthlyChallenges.find(ch => ch.day === selectedDay);
  const isChallengeCompleted = isAuthenticated && completedChallengesIDs.includes(selectedDay) && !!selectedChallenge;
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ day: 1, title: '', points: 50 });
  const isAdmin = isAuthenticated && user?.roles?.includes('ADMIN');

  useEffect(() => {
    dispatch(fetchChallengesList());
    dispatch(fetchRankingList());
  }, [dispatch]);

  const usersWhoCompleted = allUsersRanking.filter(u => 
    u.completedChallenges && u.completedChallenges.includes(selectedDay)
  );

  const handleCompleteChallenge = async () => {
    if (!isAuthenticated || !selectedChallenge) return;
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

  return (
    <div className="container mt-3 pt-5 text-center">
      <div className="d-flex justify-content-center align-items-center mb-4">
        <h2 className="title-text me-2">Desafios</h2>
        <Link to="/ranking" className="btn btn-sm">
          <i className="bi bi-arrow-repeat text-danger"></i>
        </Link>
      </div>

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
            
            <button 
                className="btn btn-outline-pink"
                onClick={handleCompleteChallenge}
                disabled={!isAuthenticated || isChallengeCompleted || selectedDay > today}
                style={
                !isAuthenticated || isChallengeCompleted || selectedDay > today
                    ? { opacity: 0.5, cursor: 'not-allowed' }
                    : { cursor: 'pointer' }
                }
            >
                {isChallengeCompleted ? "✓ Completado" : 
                 selectedDay > today ? "Trancado" : "Completar Desafio"}
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