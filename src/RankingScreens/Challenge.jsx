import { useState } from "react";
import { Link } from "react-router-dom";
import "./Challenge.css";

function Challenge() {
  const sampleUsers = [
    { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/100?img=20" },
    { id: 2, name: "Maria", avatar: "https://i.pravatar.cc/100?img=16" },
    { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/100?img=3" },
    { id: 4, name: "David", avatar: "https://i.pravatar.cc/100?img=4" },
    { id: 5, name: "Eve", avatar: "https://i.pravatar.cc/100?img=5" },
    { id: 6, name: "Hank", avatar: "https://i.pravatar.cc/100?img=8" },
    { id: 7, name: "Ivy", avatar: "https://i.pravatar.cc/100?img=9" },
    { id: 8, name: "Jack", avatar: "https://i.pravatar.cc/100?img=17" },
  ];

    const monthlyChallenges = [
        { day: 1, title: "Jogue 30 minutos em qualquer jogo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1]] },
        { day: 2, title: "Termine 1 review de um jogo", points: 50, completedBy: [sampleUsers[2], sampleUsers[3]] },
        { day: 3, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [sampleUsers[0], sampleUsers[4]] },
        { day: 4, title: "Completar 1 nível num jogo de plataforma", points: 50, completedBy: [sampleUsers[1], sampleUsers[5]] },
        { day: 5, title: "Colete 100 pontos num jogo", points: 50, completedBy: [sampleUsers[6]] },
        { day: 6, title: "Ganhe uma partida num jogo competitivo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1]] },
        { day: 7, title: "Desbloqueie um troféu escondido", points: 50, completedBy: [sampleUsers[2], sampleUsers[3]] },
        { day: 8, title: "Jogue 30 minutos em qualquer jogo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1]] },
        { day: 9, title: "Termine 1 review de um jogo", points: 50, completedBy: [sampleUsers[2], sampleUsers[3]] },
        { day: 10, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [sampleUsers[0], sampleUsers[4]] },
        { day: 11, title: "Completar 1 nível num jogo de plataforma", points: 50, completedBy: [sampleUsers[1], sampleUsers[5]] },
        { day: 12, title: "Colete 100 pontos num jogo", points: 50, completedBy: [sampleUsers[6]] },
        { day: 13, title: "Ganhe uma partida num jogo competitivo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1]] },
        { day: 14, title: "Desbloqueie um troféu escondido", points: 50, completedBy: [sampleUsers[2], sampleUsers[3]] },
        { day: 15, title: "Jogue 30 minutos em qualquer jogo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1]] },
        { day: 16, title: "Termine 1 review de um jogo", points: 50, completedBy: [sampleUsers[2], sampleUsers[3]] },
        { day: 17, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [sampleUsers[0], sampleUsers[4]] },
        { day: 18, title: "Completar 1 nível num jogo de plataforma", points: 50, completedBy: [sampleUsers[1], sampleUsers[5]] },
        { day: 19, title: "Colete 100 pontos num jogo", points: 50, completedBy: [sampleUsers[6]] },
        { day: 20, title: "Ganhe uma partida num jogo competitivo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1]] },
        { day: 21, title: "Desbloqueie um troféu escondido", points: 50, completedBy: [sampleUsers[2], sampleUsers[3]] },
        { day: 22, title: "Jogue 30 minutos em qualquer jogo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1]] },
        { day: 23, title: "Termine 1 review de um jogo", points: 50, completedBy: [sampleUsers[2], sampleUsers[3]] },
        { day: 24, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [sampleUsers[0], sampleUsers[4]] },
        { day: 25, title: "Completar 1 nível num jogo de plataforma", points: 50, completedBy: [sampleUsers[1], sampleUsers[5]] },
        { day: 26, title: "Colete 100 pontos num jogo", points: 50, completedBy: [sampleUsers[6]] },
        { day: 27, title: "Ganhe uma partida num jogo competitivo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1]] },
        { day: 28, title: "Desbloqueie um troféu escondido", points: 50, completedBy: [sampleUsers[2], sampleUsers[3]] },
        { day: 29, title: "Jogue 30 minutos em qualquer jogo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1]] },
        { day: 30, title: "Termine 1 review de um jogo", points: 50, completedBy: [sampleUsers[2], sampleUsers[3]] },
        { day: 31, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [sampleUsers[0], sampleUsers[4]] },
    ];

    const [selectedDay, setSelectedDay] = useState(new Date().getDate()); 

    const today = new Date().getDate();

  return (
    <div className="container mt-5 pt-5 text-center">
      <div className="d-flex justify-content-center align-items-center mb-4">
        <h1 className="title-text me-2">Desafios</h1>
        <Link to="/ranking" className="btn btn-sm">
          <i className="bi bi-arrow-repeat text-danger"></i>
        </Link>
      </div>
      <div className="section-line"></div>

      <Link to="/shop" className="floating-shop" aria-label="Abrir Loja">
        <i className="bi bi-shop"></i>
      </Link>

      <div className="calendar mb-4">
        {monthlyChallenges.map((challenge) => {
          const isFuture = challenge.day > today;
          return (
            <div
              key={challenge.day}
              className={`calendar-day 
                          ${challenge.day === selectedDay ? "selected" : ""} 
                          ${isFuture ? "disabled" : ""}`}
              onClick={() => {
                if (!isFuture) setSelectedDay(challenge.day);
              }}
            >
              {challenge.day}
            </div>
          );
        })}
      </div>

    <div className="challenge-card p-4 mb-4 container">
      <h4>{monthlyChallenges.find(ch => ch.day === selectedDay)?.title}</h4>
      <p>🏆 {monthlyChallenges.find(ch => ch.day === selectedDay)?.points} pontos</p>
    </div>

    <div className="ranking-list container text-start">
      <p className="section-title mb-3">Usuários que completaram o desafio:</p>
      {monthlyChallenges.find(ch => ch.day === selectedDay)?.completedBy.map((user, index) => (
        <div key={user.id} className="ranking-row d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <span className="rank-number">{index + 1}</span>
            <img src={user.avatar} alt={user.name} className="avatar-small ms-3" />
            <span className="username ms-3">{user.name}</span>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

export default Challenge;
