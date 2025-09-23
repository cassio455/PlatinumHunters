import { useState } from "react";
import { Link } from "react-router-dom";
import "./Challenge.css";

function Challenge() {
    const dailyChallenge = {
    id: 1,
    title: "Conseguir um troféu num jogo indie",
    points: 50,
    completedBy: [
        { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/100?img=20", points: 50 },
        { id: 2, name: "Maria", avatar: "https://i.pravatar.cc/100?img=16", points: 50 },
        { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/100?img=3", points: 50 },
    ]
    };

    const weeklyChallenge = {
    id: 2,
    title: "Conseguir 5 troféus em jogos competitivos",
    points: 150,
    completedBy: [
        { id: 1, name: "David", avatar: "https://i.pravatar.cc/100?img=4", points: 150 },
        { id: 2, name: "Eve", avatar: "https://i.pravatar.cc/100?img=5", points: 150 }
    ]
    };

    const monthlyChallenge = {
    id: 3,
    title: "Platinar um jogo",
    points: 500,
    completedBy: [
        { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/100?img=20", points: 500 },
        { id: 2, name: "Maria", avatar: "https://i.pravatar.cc/100?img=16", points: 500 },
        { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/100?img=3", points: 500 }
    ]
    };

    const monthlyChallenges = [
        { day: 1, title: "Jogue 30 minutos num jogo de simulação", points: 50, completedBy: [] },
        { day: 2, title: "Termine 1 review de um jogo", points: 50, completedBy: [] },
        { day: 3, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 4, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 5, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 6, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 7, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 8, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 9, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 10, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 11, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 12, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 13, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 14, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 15, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 16, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 17, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 18, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 19, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 20, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 21, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 22, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 23, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 24, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 25, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 26, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 27, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 28, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 29, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
        { day: 30, title: "Conseguir 1 troféu num jogo indie", points: 50, completedBy: [] },
    ];

    const [selectedDay, setSelectedDay] = useState(new Date().getDate()); // start with today

    const [activeTab, setActiveTab] = useState("daily");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const getCurrentChallenge = () => {
        if (activeTab === "daily") return dailyChallenge;
        if (activeTab === "weekly") return weeklyChallenge;
        if (activeTab === "monthly") return monthlyChallenge;
    };

    const currentChallenge = getCurrentChallenge();

  return (
    <div className="container mt-5 pt-5 text-center">
      {/* Title + switch button */}
      <div className="d-flex justify-content-center align-items-center mb-4">
        <h1 className="me-2">Desafios</h1>
        <Link to="/ranking" className="btn btn-sm">
          <i className="bi bi-arrow-repeat text-danger"></i>
        </Link>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs justify-content-center mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "daily" ? "active" : ""}`}
            onClick={() => handleTabChange("daily")}>
            Diário
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "weekly" ? "active" : ""}`}
            onClick={() => handleTabChange("weekly")}>
            Semanal
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "monthly" ? "active" : ""}`}
            onClick={() => handleTabChange("monthly")}>
            Mensal
          </button>
        </li>
      </ul>

    <div className="calendar mb-4">
        {monthlyChallenges.map((challenge) => (
            <div
            key={challenge.day}
            className={`calendar-day ${challenge.day === selectedDay ? "selected" : ""}`}
            onClick={() => setSelectedDay(challenge.day)}
            >
            {challenge.day}
            </div>
        ))}
    </div>

    <div className="challenge-card p-4 mb-4 container">
        <h4>{monthlyChallenges.find(ch => ch.day === selectedDay)?.title}</h4>
        <p>🏆 {monthlyChallenges.find(ch => ch.day === selectedDay)?.points} points</p>
    </div>

      {/* Completed By List */}
      <div className="ranking-list container">
        <div className="ranking-list text-start">
            {currentChallenge.completedBy.map((user, index) => (
            <div
                key={user.id}
                className="ranking-row d-flex align-items-center justify-content-between"
            >
                <div className="d-flex align-items-center">
                <span className="rank-number">{index + 1}</span>
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="avatar-small ms-3"
                />
                <span className="username ms-3">{user.name}</span>
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Challenge;
