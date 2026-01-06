import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRankingList } from "../app/thunks/rankingThunks"; 
import "./RankingMain.css";

function RankingMain() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const rankingList = useSelector((state) => state.ranking?.list || []);
  const { rankingPoints } = useSelector((state) => state.shop);
  const [activeTab, setActiveTab] = useState("all"); 

  useEffect(() => {
    dispatch(fetchRankingList());
  }, [dispatch]);

  const getCurrentData = () => {
    return rankingList.map(u => ({
      ...u,
      isCurrentUser: user && (u.name === user.username || u.name === user.name)
    }));
  };

  const currentRankingData = getCurrentData();

  const getPointsTitle = () => {
    if (activeTab === "week") return "Pontos (Semana)";
    if (activeTab === "month") return "Pontos (Mês)";
    return "Pontos (Total)";
  };

return (
    <div className="container mt-3 pt-5 text-center">
      
      {/* --- CABEÇALHO MODIFICADO --- */}
      <div className="page-header-container">
        <h2 className="title-text m-0">Ranking</h2>
        
        <Link to="/challenge" className="nav-corner-btn">
          Ir para Desafios <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>
      {/* ----------------------------- */}

      <Link to="/shop" className="floating-shop" aria-label="Abrir Loja">
        <i className="bi bi-shop"></i>
      </Link>

      <ul className="nav nav-tabs justify-content-center mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
            Global
          </button>
        </li>
      </ul>
      
      <div className="ranking-list container pt-3 text-start">
        {/* ... (O resto do código da lista mantém-se IGUAL, não precisa mexer) ... */}
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
        
        {currentRankingData.length > 0 ? (
          currentRankingData.map((userItem, index) => (
            <div 
              key={userItem.id || index} 
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
                  <span className="trophies text-end">{userItem.rankingPoints}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-5">Carregando ranking...</p>
        )}
      </div>
    </div>
  );
}

export default RankingMain;