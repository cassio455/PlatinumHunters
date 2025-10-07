import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./Shop.css";

function Shop() {
  const [points, setPoints] = useState(350);
  const [ownedTitles, setOwnedTitles] = useState([]);
  const [equippedTitle, setEquippedTitle] = useState(null);

  const titles = [
    { id: 1, name: "🌸 Explorador de Sakura 🌸", cost: 100 },
    { id: 2, name: "⚔️ Caçador de Elite ⚔️", cost: 200 },
    { id: 3, name: "🧩 Complecionista de Puzzles 🧩", cost: 150 },
    { id: 4, name: "📝 Mestre das Reviews 📝", cost: 250 },
  ];

  const buyTitle = (title) => {
    if (ownedTitles.includes(title.name)) return;
    if (points < title.cost) {
      alert("Você não tem pontos suficientes!");
      return;
    }
    setPoints(points - title.cost);
    setOwnedTitles([...ownedTitles, title.name]);
  };

  const equipTitle = (title) => {
    if (!ownedTitles.includes(title.name)) return;
    setEquippedTitle(title.name);
  };

  return (
    <div className="title-shop container mt-5 pt-5">
      <h1 className="shop-title">Loja de Títulos</h1>
      <p className="points-display">Seus pontos: {points}</p>
      <div className="section-line"></div>

      <Link to="/ranking" className="floating-ranking" aria-label="Abrir Rank">
        <i className="bi bi-arrow-left"></i>
      </Link>

      <div className="titles-grid mt-5">
        {titles.map((title) => (
          <div key={title.id} className="title-card">
            <h4>{title.name}</h4>
            <p>Custo: {title.cost} pts</p>

            {ownedTitles.includes(title.name) ? (
              <button
                className={`equip-btn ${
                  equippedTitle === title.name ? "equipped" : ""
                }`}
                onClick={() => equipTitle(title)}
              >
                {equippedTitle === title.name ? "Equipado" : "Equipar"}
              </button>
            ) : (
              <button className="buy-btn" onClick={() => buyTitle(title)}>
                Comprar
              </button>
            )}
          </div>
        ))}
      </div>

      {equippedTitle && (
        <p className="equipped-text">
          Título equipado: <span>{equippedTitle}</span>
        </p>
      )}
    </div>
  );
}

export default Shop;
