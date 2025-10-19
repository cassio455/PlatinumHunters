import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { completeChallenge } from "../app/slices/shopSlice";
import { monthlyChallenges} from "../sample"
import "./Challenge.css";

function Challenge() {
  const dispatch = useDispatch();
  const { rankingPoints, completedChallenges, equippedTitle, permanentUsers } = useSelector((state) => state.shop);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [selectedDay, setSelectedDay] = useState(new Date().getDate()); 
  const today = new Date().getDate();
  const selectedChallenge = monthlyChallenges.find(ch => ch.day === selectedDay);
  const isChallengeCompleted = isAuthenticated && completedChallenges.includes(selectedDay);

  const handleCompleteChallenge = () => {
    dispatch(completeChallenge({ 
      day: selectedDay, 
      points: selectedChallenge.points 
    }));

    const currentUserData = {
      id: user?.id || `user_${Date.now()}`,
      name: (typeof user === 'object' && user !== null) ? user.name : user,
      avatar: user?.avatar || "https://i.pravatar.cc/100?img=3",
      platinums: user?.platinums || 0,
      totalTrophies: user?.totalTrophies || 0,
      equippedTitle: equippedTitle,
      allTimePoints: rankingPoints + selectedChallenge.points,
    };

    const userExists = selectedChallenge.completedBy?.some(
      u => u.name === currentUserData.name
    );

    if (!userExists) {
      if (!selectedChallenge.completedBy) {
        selectedChallenge.completedBy = [];
      }
      selectedChallenge.completedBy.push(currentUserData);
    }
  };

  const getUsersWhoCompleted = () => {
    const baseUsers = selectedChallenge?.completedBy || [];
    const permanentUsers = useSelector((state) => state.shop.permanentUsers);
    
    if (isChallengeCompleted && user) {
      const currentUser = {
        id: user?.id || 'current',
        name: (typeof user === 'object' && user !== null) ? user.name : user,
        avatar: user?.avatar || "https://i.pravatar.cc/100?img=3",
        platinums: user?.platinums || 0,
        totalTrophies: user?.totalTrophies || 0,
        equippedTitle: equippedTitle,
        isCurrentUser: true,
        allTimePoints: rankingPoints,
      };

      const userIndex = baseUsers.findIndex(u => u.name === currentUser.name);
      
      if (userIndex !== -1) {
        return baseUsers.map((u, idx) => 
          idx === userIndex 
            ? { ...u, ...currentUser, isCurrentUser: true }
            : u
        );
      }
      
      return [currentUser, ...baseUsers];
    }
    
    return baseUsers.map(u => {
      const permanentData = Object.values(permanentUsers).find(p => p.name === u.name);
      if (permanentData) {
        return { ...u, equippedTitle: permanentData.equippedTitle };
      }
      return u;
    });
  };

  const completedByUsers = getUsersWhoCompleted();

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
            {user?.name}, seus pontos: {rankingPoints}
          </span>
        ) : (
          <span style={{ color: '#ccc', fontSize: '1.2rem' }}>
            Faça login para completar desafios!
          </span>
        )}
      </div>

      <div className="section-line"></div>

      <Link to="/shop" className="floating-shop" aria-label="Abrir Loja">
        <i className="bi bi-shop"></i>
      </Link>

      <div className="calendar mb-4">
        {monthlyChallenges.map((challenge) => {
          const isFuture = challenge.day > today;
          const isCompleted = isAuthenticated && completedChallenges.includes(challenge.day);
          return (
            <div
              key={challenge.day}
              className={`calendar-day 
                          ${challenge.day === selectedDay ? "selected" : ""} 
                          ${isFuture ? "disabled" : ""}`}
              onClick={() => {
                if (!isFuture) setSelectedDay(challenge.day);
              }}
            style={isCompleted ? { 
                background: '#4CAF50', 
                color: 'white',
                fontWeight: 'bold' 
              } : {}}
            >
              {isCompleted ? '✓' : challenge.day}
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

    <div className="ranking-list container text-start">
      <div className="ranking-header d-none d-md-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <span className="ms-3" style={{width: '200px'}}>Usuário</span>
        </div>
        <div className="d-flex align-items-center">
          <div className="user-stats text-end">
            <span className="stat-item">Platinas</span>
            <span className="stat-item">Troféus</span>
          </div>
            <div className="trophies text-end ps-3">Pontos</div>
        </div>
      </div>
      
      <div className="section-line d-md-none"></div>
      
      {completedByUsers.length > 0 ? (
        completedByUsers.map((userItem, index) => (
          <div 
            key={userItem.id} 
            className="ranking-row"
            style={userItem.isCurrentUser ? { 
              border: '2px solid #fa5f69',
              background: 'rgba(250, 95, 105, 0.1)'
            } : {}}
          >
            <div className="d-flex align-items-center">
              <span className="rank-number">{index + 1}</span>
              <img src={userItem.avatar} alt={userItem.name} className="avatar-small ms-3" />
              <div className="ms-3">
                <div className="d-flex align-items-center">
                  <span className="username" style={{fontSize: '1rem', marginTop: 0}}>
                    {userItem.name}
                  </span>
                  {userItem.isCurrentUser && (
                    <span style={{ color: '#fa5f69', marginLeft: '8px', fontSize: '0.9rem' }}>
                      (Você) ⭐
                    </span>
                  )}
                </div>
                {userItem.equippedTitle && (
                  <div style={{ fontSize: '0.75rem', color: '#ccc' }}>
                    {userItem.equippedTitle}
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex">
              <div className="user-stats">
                <span className="stat-item" title="Platinas">
                  {userItem.platinums || 0}
                </span>
                <span className="stat-item" title="Total de Troféus">
                  {userItem.totalTrophies || 0}
                </span>
                <span className="trophies text-end ps-3">
                  {userItem.allTimePoints || 0}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: '#ccc', textAlign: 'center' }}>
          Ninguém completou este desafio ainda. Seja o primeiro!
        </p>
      )}
      </div>
    </div>
  );
}

export default Challenge;