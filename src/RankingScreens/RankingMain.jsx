import { Link } from "react-router-dom";
import { useState } from "react";
import "./RankingMain.css";

function RankingMain() {
  const weekly = [
    { id: 1, name: "Alice", points: 1500, avatar: "https://i.pravatar.cc/100?img=20" },
    { id: 2, name: "Maria", points: 1400, avatar: "https://i.pravatar.cc/100?img=16" },
    { id: 3, name: "Charlie", points: 1300, avatar: "https://i.pravatar.cc/100?img=3" },
    { id: 4, name: "David", points: 1200, avatar: "https://i.pravatar.cc/100?img=4" },
    { id: 5, name: "Eve", points: 1100, avatar: "https://i.pravatar.cc/100?img=5" },
  ];

  const monthly = [
    { id: 1, name: "Hank", points: 2500, avatar: "https://i.pravatar.cc/100?img=8" },
    { id: 2, name: "Ivy", points: 2400, avatar: "https://i.pravatar.cc/100?img=9" },
    { id: 3, name: "Jack", points: 2300, avatar: "https://i.pravatar.cc/100?img=17" },
    { id: 4, name: "Kate", points: 2200, avatar: "https://i.pravatar.cc/100?img=19" },
    { id: 5, name: "Leo", points: 2100, avatar: "https://i.pravatar.cc/100?img=12" },
  ];

  const allTime = [
    { id: 1, name: "Mia", points: 3500, avatar: "https://i.pravatar.cc/100?img=21" },
    { id: 2, name: "Nina", points: 3400, avatar: "https://i.pravatar.cc/100?img=22" },
    { id: 3, name: "Oscar", points: 3300, avatar: "https://i.pravatar.cc/100?img=15" },
    { id: 4, name: "Alice", points: 3200, avatar: "https://i.pravatar.cc/100?img=20" },
    { id: 5, name: "Maria", points: 3100, avatar: "https://i.pravatar.cc/100?img=16" },
  ];

  const [currentData, setCurrentData] = useState(weekly);
  const [activeTab, setActiveTab] = useState("week");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "week") setCurrentData(weekly);
    if (tab === "month") setCurrentData(monthly);
    if (tab === "all") setCurrentData(allTime);
  };

  const top3 = currentData.slice(0, 3);
  const others = currentData.slice(3);

  return (
    <div className="container mt-5 pt-5 text-center">
      <div className="d-flex justify-content-center align-items-center mb-4">
        <h1 className="me-2">Ranking</h1>
        <Link to="/challenge" className="btn btn-sm">
          <i className="bi bi-arrow-repeat text-danger"></i>
        </Link>
      </div>

      <ul className="nav nav-tabs justify-content-center mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "week" ? "active" : ""}`} onClick={() => handleTabChange("week")}>
            Desta Semana
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "month" ? "active" : ""}`} onClick={() => handleTabChange("month")}>
            Deste Mês
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "all" ? "active" : ""}`} onClick={() => handleTabChange("all")}>
            De Todos os Tempos
          </button>
        </li>
      </ul>

      <div className="game-search-bar container">
        <form className="d-flex mt-2 mt-lg-0 w-100 w-lg-auto">
          <input className="form-control me-2" type="search" placeholder="Pesquisar usuário ou jogo"/>
          <button className="btn search-btn" type="submit">
              <i className="bi bi-search"></i>
          </button>
        </form>
      </div>

      <div className="podium d-flex justify-content-center align-items-end pt-5">
        <div className="podium-spot second">
          <img src={top3[1]?.avatar} alt={top3[1]?.name} className="avatar" />
          <p className="username">{top3[1]?.name}</p>
          <p className="trophies">🏆 {top3[1]?.points}</p>
        </div>

        <div className="podium-spot first">
          <img src={top3[0]?.avatar} alt={top3[0]?.name} className="avatar" />
          <p className="username">{top3[0]?.name}</p>
          <p className="trophies">🏆 {top3[0]?.points}</p>
        </div>

        <div className="podium-spot third">
          <img src={top3[2]?.avatar} alt={top3[2]?.name} className="avatar" />
          <p className="username">{top3[2]?.name}</p>
          <p className="trophies">🏆 {top3[2]?.points}</p>
        </div>
      </div>

      <div className="ranking-list container">
        <div className="ranking-list mt-5 text-start">
          {others.map((user, index) => (
            <div key={user.id} className="ranking-row d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="rank-number">{index + 4}</span>
                <img src={user.avatar} alt={user.name} className="avatar-small ms-3" />
                <span className="username ms-3">{user.name}</span>
              </div>
              <div className="trophies">🏆 {user.points}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RankingMain;
