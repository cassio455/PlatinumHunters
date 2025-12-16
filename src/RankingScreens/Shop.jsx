import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { buyTitleAPI, equipTitleAPI } from "../app/thunks/shopThunks"; // Importe os Thunks
import "./Shop.css";

function Shop() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Agora esses dados vêm sincronizados do Login/API
  const { coins, ownedTitles, equippedTitle, loading } = useSelector((state) => state.shop);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const titles = [
    { id: 1, name: "🌸 Explorador de Sakura 🌸", cost: 100 },
    { id: 2, name: "⚔️ Caçador de Elite ⚔️", cost: 200 },
    { id: 3, name: "🧩 Complecionista de Puzzles 🧩", cost: 150 },
    { id: 4, name: "📝 Mestre das Reviews 📝", cost: 250 },
    { id: 5, name: "✨ Colecionador de Estrelas ✨", cost: 300 },
    { id: 6, name: "🛡️ Defensor Lendário 🛡️", cost: 450 },
    { id: 7, name: "🌌 Viajante Interdimensional 🌌", cost: 500 },
    { id: 8, name: "👑 Soberano do Reino 👑", cost: 1000 },
    { id: 9, name: "🔮 Oráculo Misterioso 🔮", cost: 750 },
    { id: 10, name: "🚀 Piloto Estelar 🚀", cost: 600 },
    { id: 11, name: "💖 Coração de Ouro 💖", cost: 200 },
    { id: 12, name: "⚙️ Engenheiro Mestre ⚙️", cost: 350 },
    { id: 13, name: "🖋️ Cronista da História 🖋️", cost: 250 },
    { id: 14, name: "💎 Tesouro Perdido 💎", cost: 850 },
    { id: 15, name: "🌙 Sentinela Noturno 🌙", cost: 400 },
  ];

  const handleBuyTitle = async (title) => {
    if (!isAuthenticated) {
      navigate('/user/login');
      return;
    }
    if (coins < title.cost) {
      alert("Moedas insuficientes!");
      return;
    }

    // Chama a API
    const result = await dispatch(buyTitleAPI({ name: title.name, cost: title.cost }));
    
    if (buyTitleAPI.fulfilled.match(result)) {
      alert(`Você comprou: ${title.name}`);
    } else {
      alert(result.payload || "Erro na compra");
    }
  };

  const handleEquipTitle = (title) => {
    if (!isAuthenticated) return;
    dispatch(equipTitleAPI(title.name));
  };

  return (
    <div className="title-shop container mt-3 pt-5">
      <h2 className="shop-title">Loja de Títulos</h2>

      {isAuthenticated ? (
        <p className="points-display" style={{ color: '#fa5f69', fontSize: '1.2rem', fontWeight: 'bold' }}>
          {user?.username}, suas moedas: {coins} {loading && "(Atualizando...)"}
        </p>
      ) : (
        <p className="points-display" style={{ color: '#ccc' }}>
          Faça login para comprar títulos!
        </p>
      )}

      <div className="shop-divider-line"></div>

      <Link to="/ranking" className="floating-ranking" aria-label="Abrir Rank">
        <i className="bi bi-arrow-left"></i>
      </Link>

      <div className="titles-grid mt-5">
        {titles.map((title) => (
          <div key={title.id} className="title-card">
            <h4>{title.name}</h4>
            <p>Custo: {title.cost} moedas</p>

            {ownedTitles.includes(title.name) ? (
              <button
                className={`equip-btn ${
                  equippedTitle === title.name ? "equipped" : ""
                }`}
                onClick={() => handleEquipTitle(title)}
                disabled={!isAuthenticated}
              >
                {equippedTitle === title.name ? "Equipado" : "Equipar"}
              </button>
            ) : (
              <button 
                className="buy-btn" 
                onClick={() => handleBuyTitle(title)}
                disabled={!isAuthenticated || coins < title.cost}
                style={!isAuthenticated || coins < title.cost ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              >
                {isAuthenticated ? "Comprar" : "🔒 Login necessário"}
              </button>
            )}
          </div>
        ))}
      </div>

      {equippedTitle && isAuthenticated && (
        <p className="equipped-text">
          Título equipado: <span>{equippedTitle}</span>
        </p>
      )}
    </div>
  );
}

export default Shop;