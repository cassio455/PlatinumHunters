
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card, InputGroup, Form } from 'react-bootstrap';
import { sampleGames } from '../../sample';
import '../../Main/Main.css';

const Biblioteca = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = sampleGames.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-page container mt-5 pt-5">
      <div className="section-header mb-4">
        <h1 className="section-title text-center mb-2">Minha Biblioteca</h1>
        <div className="section-line"></div>
        <p className="page-subtitle">Gerencie seus jogos e acompanhe seu progresso</p>
        <div className="row justify-content-center mt-4">
          <div className="col-12 col-md-6">
            <InputGroup>
              <InputGroup.Text className="bg-dark border-secondary" style={{ borderRight: 0 }}>
                <Search size={18} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                className="bg-dark text-white border-secondary"
                placeholder="Pesquisar jogos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ boxShadow: 'none' }}
                autoComplete="off"
                aria-label="Pesquisar jogos"
              />
            </InputGroup>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        {filteredGames.length === 0 && (
          <div className="col-12 text-center text-muted">Nenhum jogo encontrado.</div>
        )}
        {filteredGames.map((game) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={game.id}>
            <Card className="game-card border-light bg-dark text-white h-100">
              <div className="game-image-container">
                <Link to={`/biblioteca/detalhes/${game.id}`}>
                  <Card.Img variant="top" src={game.img} alt={game.name} className="card-img-top" />
                </Link>
                <div className="overlay">
                  <h5 className="game-title">{game.name}</h5>
                </div>
              </div>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#FF6E77', fontWeight: 'bold' }}>Status:</span>
                  <span className="fw-bold text-white">{game.status || '-'}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#FF6E77', fontWeight: 'bold' }}>Progresso:</span>
                  <span className="fw-bold text-white">{game.progresso || '-'}</span>
                </div>
                <div className="d-flex justify-content-end">
                  <Link to={`/biblioteca/detalhes/${game.id}`} className="btn btn-outline-light btn-sm">
                    Detalhes
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <div className="filters-section mt-5">
        <h5 className="filters-title mb-3">Filtros</h5>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          <button className="btn btn-outline-light filter-btn">Jogando</button>
          <button className="btn btn-outline-light filter-btn">Platinado</button>
          <button className="btn btn-outline-light filter-btn">Abandonado</button>
          <button className="btn btn-outline-light filter-btn">PSN</button>
          <button className="btn btn-outline-light filter-btn">Steam</button>
        </div>
      </div>
    </div>
  );
};

export default Biblioteca;