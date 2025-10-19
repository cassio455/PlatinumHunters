import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { weeklyRanking, monthlyRanking, allTimeRanking } from "../sample" 
import "./RankingMain.css";

function RankingMain() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { rankingPoints: currentUserPoints, equippedTitle, permanentUsers } = useSelector((state) => state.shop); 
  const [activeTab, setActiveTab] = useState("week");

  const getPointsField = (tab) => {
    if (tab === "week") return "weeklyPoints";
    if (tab === "month") return "monthlyPoints";
    return "allTimePoints";
  };

  const getRankingWithUser = (baseRanking) => {
    const pointsField = getPointsField(activeTab);

    let enrichedRanking = baseRanking.map(u => {
      const permanentData = Object.values(permanentUsers || {}).find(p => p.name === u.name);
      if (permanentData) {
        return { ...u, equippedTitle: permanentData.equippedTitle };
      }
      return u;
    });
    
    if (currentUserPoints === 0 || !isAuthenticated) {
      return enrichedRanking;
    }

    const currentUser = {
      id: 'current',
      name: (typeof user === 'object' && user !== null) ? user.name : user || 'Você',
      [pointsField]: currentUserPoints, 
      avatar: user?.avatar || "https://i.pravatar.cc/100?img=3",
      isCurrentUser: isAuthenticated,
      equippedTitle: equippedTitle,
      platinums: user?.platinums || 0,
      totalTrophies: user?.totalTrophies || 0,
    };

    const sortRanking = (ranking) => ranking.sort((a, b) => b[pointsField] - a[pointsField]);
    
    const userExists = enrichedRanking.some(u => u.name === currentUser.name && u.id !== 'current');
    
    if (userExists) {
      const updatedRanking = enrichedRanking.map(u => 
        u.name === currentUser.name 
          ? { ...u, [pointsField]: currentUserPoints, isCurrentUser: isAuthenticated, equippedTitle: currentUser.equippedTitle }
          : u
      );
      return sortRanking(updatedRanking);
    }

    const newRanking = [...enrichedRanking, currentUser];
    return sortRanking(newRanking);
  };

  const getCurrentData = useMemo(() => {
    let baseData;
    if (activeTab === "week") baseData = weeklyRanking;
    else if (activeTab === "month") baseData = monthlyRanking;
    else baseData = allTimeRanking;
    return getRankingWithUser(baseData); 
  }, [activeTab, isAuthenticated, currentUserPoints, user, equippedTitle, permanentUsers]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const others = getCurrentData;

  const getPointsTitle = () => {
    if (activeTab === "week") return "Pontos (Semana)";
    if (activeTab === "month") return "Pontos (Mês)";
    return "Pontos (Total)";
  };

  return (
    <div className="container mt-3 pt-5 text-center">
      <div className="d-flex justify-content-center align-items-center mb-4">
        <h2 className="title-text me-2">Ranking</h2>
        <Link to="/challenge" className="btn btn-sm">
          <i className="bi bi-arrow-repeat text-danger"></i>
        </Link>
      </div>

      <Link to="/shop" className="floating-shop" aria-label="Abrir Loja">
        <i className="bi bi-shop"></i>
      </Link>

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
      
      <div className="ranking-list container pt-3 text-start">
        <div className="ranking-header d-none d-md-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <span className="ms-3" style={{width: '200px'}}>Usuário</span>
          </div>
          <div className="d-flex align-items-center">
            <div className="user-stats text-end">
              <span className="stat-item">Platinas</span>
              <span className="stat-item">Troféus</span>
            </div>
            <div className="trophies text-end">{getPointsTitle()}</div> 
          </div>
        </div>
        
        {others.map((userItem, index) => {
          const pointsField = getPointsField(activeTab);
          const pointsToDisplay = userItem[pointsField] || 0;

          return (
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
                  <span className="trophies text-end">{pointsToDisplay}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RankingMain;