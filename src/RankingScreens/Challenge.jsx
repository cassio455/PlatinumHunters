import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { completeChallengeAPI } from "../app/thunks/rankingThunks"; 
import { monthlyChallenges } from "../sample"; 
import "./Challenge.css";

function Challenge() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Como atualizamos o authSlice, esses dados mudam sozinhos na tela!
  const rankingPoints = user?.rankingPoints || 0;
  const completedChallengesIDs = user?.completedChallenges || [];

  const [selectedDay, setSelectedDay] = useState(new Date().getDate()); 
  const today = new Date().getDate();
  const selectedChallenge = monthlyChallenges.find(ch => ch.day === selectedDay);
  
  const isChallengeCompleted = isAuthenticated && completedChallengesIDs.includes(selectedDay);

  const handleCompleteChallenge = async () => {
    if (!isAuthenticated) return;

    // Apenas despacha. O authSlice vai pegar o resultado e atualizar a tela.
    try {
        await dispatch(completeChallengeAPI({ 
            day: selectedDay, 
            points: selectedChallenge.points 
        })).unwrap();
        // Se quiser, pode colocar um toast/alerta aqui: "Desafio completado!"
    } catch (error) {
        console.error("Falha ao completar:", error);
        alert("Erro ao completar desafio. Tente novamente.");
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
            Faça login para completar desafios!
          </span>
        )}
      </div>

      <div className="challenge-divider-line"></div>

      <Link to="/shop" className="floating-shop" aria-label="Abrir Loja">
        <i className="bi bi-shop"></i>
      </Link>

      <div className="calendar mb-4">
        {monthlyChallenges.map((challenge) => {
          const isFuture = challenge.day > today;
          // Verifica se ESSE dia específico está na lista do usuário
          const isDone = isAuthenticated && completedChallengesIDs.includes(challenge.day);
          
          return (
            <div
              key={challenge.day}
              className={`calendar-day 
                          ${challenge.day === selectedDay ? "selected" : ""} 
                          ${isFuture ? "disabled" : ""}`}
              onClick={() => {
                if (!isFuture) setSelectedDay(challenge.day);
              }}
              style={isDone ? { 
                background: '#4CAF50', 
                color: 'white',
                fontWeight: 'bold' 
              } : {}}
            >
              {isDone ? '✓' : challenge.day}
            </div>
          );
        })}
      </div>

    <div className="challenge-card p-4 mb-4 container">
      <h4>{selectedChallenge?.title}</h4>
      <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
        {selectedChallenge?.points} pontos
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
          {!isAuthenticated
            ? "🔒 Faça login para completar"
            : isChallengeCompleted 
            ? "✓ Completado" 
            : "Completar Desafio"}
      </button>
      {isChallengeCompleted && isAuthenticated && (
        <p style={{ color: '#4CAF50', marginTop: '15px', fontWeight: 'bold' }}>
          ✓ Você já completou este desafio!
        </p>
      )}
    </div>
    </div>
  );
}

export default Challenge;