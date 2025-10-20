
import { React, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Trash2, ArrowLeft, PencilLine } from 'lucide-react';
import { sampleGames } from '../../sample';
import { useSelector } from 'react-redux';
import { updateGameProgress } from '../../app/thunks/libraryThunks';

import './detalhes.css';

const Detalhes = () => {
    const { id, userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const game = useSelector((state) => state.library.library.find(g => String(g.id) === String(id)));
    const loading = useSelector((state) => state.library.loading);
    const [progressInput, setProgressInput] = useState(game ? (game.progress ?? 0) : 0);

    useEffect(() => {
        if (game) setProgressInput(game.progress ?? 0);
    }, [game]);

    const handleRemoveGame = () => {
        console.log(`Removendo jogo ${game.name} da biblioteca`);
        navigate(userId ? `/biblioteca/user/${userId}` : '/biblioteca');
    };
    /*const
        useEffect(() => {

        }, []);
    */
    if (!game) {
        return (
            <div className="detalhes-page">
                <div className="game-details-container">
                    <div className="text-center py-5">
                        <h2 className="text-white mb-4">Jogo não encontrado</h2>
                        <Button
                            variant="outline-light"
                            onClick={() => navigate(userId ? `/biblioteca/user/${userId}` : `/biblioteca/user/1`)}
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
                        <div className="info-item d-flex mb-3 align-items-center">
                            <span className="info-label">Progresso:</span>
                            <span className="info-value fw-bold ms-2">{game.progresso || '-'}</span>
                            <div className="ms-3 d-flex align-items-center">
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={progressInput}
                                    onChange={(e) => setProgressInput(e.target.value)}
                                    className="form-control form-control-sm bg-dark text-white border-secondary"
                                    style={{ width: 80 }}
                                    aria-label="Progresso do jogo"
                                />
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    className="ms-2"
                                    disabled={loading}
                                    onClick={() => {
                                        let p = Number(progressInput);
                                        if (Number.isNaN(p)) return;
                                        p = Math.max(0, Math.min(100, Math.round(p)));
                                        dispatch(updateGameProgress(game.id, p));
                                    }}
                                >
                                    Salvar
                                </Button>
                            </div>
                        </div>
                        <div className="info-item d-flex">
                            <span className="info-label">Plataformas:</span>
                            <span className="info-value fw-bold ms-2">{game.platforms.join(', ') || '-'}</span>
                        </div>
                    </div>
                </div>
                <div className="actions-section d-flex flex-column flex-md-row gap-3 justify-content-center mt-4">
                    <Button
                        variant="outline-light"
                        onClick={() => navigate(userId ? `/biblioteca/user/${userId}` : `/biblioteca/user/1`)}
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