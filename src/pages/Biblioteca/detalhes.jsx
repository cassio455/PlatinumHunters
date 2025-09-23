
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Trash2, ArrowLeft } from 'lucide-react';
import { sampleGames } from '../../sample';
import './detalhes.css';

const Detalhes = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const game = sampleGames.find(g => String(g.id) === String(id));

    const handleRemoveGame = () => {
        console.log(`Removendo jogo ${game.name} da biblioteca`);
        navigate('/biblioteca');
    };

    if (!game) {
        return (
            <div className="detalhes-page">
                <div className="game-details-container">
                    <div className="text-center py-5">
                        <h2 className="text-white mb-4">Jogo não encontrado</h2>
                        <Button
                            variant="outline-light"
                            onClick={() => navigate('/biblioteca')}
                        >
                            <ArrowLeft size={18} className="me-2" />
                            Voltar para Biblioteca
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="detalhes-page">
            <div className="game-details-container">
                <div className="card-content d-flex bg-dark text-white border-secondary mb-4">
                    <div className="image-section d-flex align-items-center justify-content-center">
                        <img
                            src={game.img}
                            alt={game.name}
                            className="game-image rounded"
                        />
                    </div>
                    <div className="info-section d-flex flex-column justify-content-center">
                        <h1 className="game-title fw-bold mb-4">
                            {game.name}
                        </h1>
                        <div className="info-item d-flex mb-3">
                            <span className="info-label">Status:</span>
                            <span className="info-value fw-bold ms-2">{game.status || '-'}</span>
                        </div>
                        <div className="info-item d-flex mb-3">
                            <span className="info-label">Progresso:</span>
                            <span className="info-value fw-bold ms-2">{game.progresso || '-'}</span>
                        </div>
                    </div>
                </div>
                <div className="actions-section d-flex flex-column flex-md-row gap-3 justify-content-center mt-4">
                    <Button
                        variant="outline-light"
                        onClick={() => navigate('/biblioteca')}
                        className="btn-action d-flex align-items-center justify-content-center"
                    >
                        <ArrowLeft size={18} className="me-2" />
                        Voltar para Biblioteca
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleRemoveGame}
                        className="btn-action d-flex align-items-center justify-content-center"
                    >
                        <Trash2 size={18} className="me-2" />
                        Remover da Biblioteca
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Detalhes;