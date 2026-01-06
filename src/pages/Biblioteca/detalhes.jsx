import { React, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Alert } from 'react-bootstrap';
import { Trash2, ArrowLeft, Save, Trophy } from 'lucide-react';
import { useSelector } from 'react-redux';
import { updateLibraryGame, removeGameFromLibrary } from '../../app/thunks/libraryThunks';

import './detalhes.css';

const Detalhes = () => {
    const { id, userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const game = useSelector((state) => state.library.library.find(g => String(g.id) === String(id)));
    const loading = useSelector((state) => state.library.loading);
    const [statusInput, setStatusInput] = useState(game ? (game.status || 'Lista de Desejos') : 'Lista de Desejos');
    const [actionError, setActionError] = useState(null);
    const [actionSuccess, setActionSuccess] = useState(null);
    const [removing, setRemoving] = useState(false);

    useEffect(() => {
        if (game) {
            setStatusInput(game.status || 'Lista de Desejos');
        }
    }, [game]);

    // Detecta se houve alterações
    const hasChanges = useMemo(() => {
        if (!game) return false;
        const currentStatus = game.status || 'Lista de Desejos';
        return statusInput !== currentStatus;
    }, [game, statusInput]);

    const handleRemoveGame = async () => {
        if (!game) return;

        const confirmRemove = window.confirm(`Tem certeza que deseja remover "${game.name}" da biblioteca?`);
        if (!confirmRemove) return;

        setActionError(null);
        setRemoving(true);

        const result = await dispatch(removeGameFromLibrary(game.gameId));

        setRemoving(false);

        if (result.success) {
            navigate(userId ? `/biblioteca/user/${userId}` : '/biblioteca');
        } else {
            setActionError(result.error || 'Erro ao remover jogo da biblioteca');
        }
    };

    const handleSaveChanges = async () => {
        setActionError(null);
        setActionSuccess(null);

        const updates = {};

        // Adiciona status se foi alterado
        const currentStatus = game.status || 'Lista de Desejos';
        if (statusInput !== currentStatus) {
            updates.status = statusInput;
        }

        if (Object.keys(updates).length === 0) return;

        const result = await dispatch(updateLibraryGame(game.gameId, updates));

        if (!result.success) {
            setActionError(result.error || 'Erro ao salvar alterações');
        } else {
            setActionSuccess('Alterações salvas com sucesso!');
            setTimeout(() => setActionSuccess(null), 3000);
        }
    };

    if (!game) {
        return (
            <div className="detalhes-page">
                <div className="details-page-body">
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
            <div className="details-page-body">
                {/* Header com imagem de fundo e título */}
                <div className="details-video-container">
                    <img
                        src={game.img || 'https://via.placeholder.com/800x450/1a1a1a/666666?text=Sem+Imagem'}
                        alt={game.name}
                        className="details-video-header"
                    />
                    <div className="details-video-overlay">
                        <h2 className="details-title">{game.name}</h2>
                    </div>
                    <Button
                        variant="dark"
                        className="details-back-btn"
                        onClick={() => navigate(userId ? `/biblioteca/user/${userId}` : `/biblioteca/user/1`)}
                    >
                        <ArrowLeft size={24} />
                    </Button>
                </div>

                {/* Conteúdo com detalhes */}
                <div className="details-content-area">
                    {actionError && (
                        <Alert variant="danger" dismissible onClose={() => setActionError(null)} className="mb-3">
                            {actionError}
                        </Alert>
                    )}
                    {actionSuccess && (
                        <Alert variant="success" dismissible onClose={() => setActionSuccess(null)} className="mb-3">
                            {actionSuccess}
                        </Alert>
                    )}

                    <h3 className="section-subtitle">Informações da Biblioteca:</h3>

                    <div className="info-grid">
                        <div className="info-row">
                            <span className="info-label-new">Status:</span>
                            <div className="d-flex align-items-center gap-2">
                                <select
                                    value={statusInput}
                                    onChange={(e) => setStatusInput(e.target.value)}
                                    className="status-select"
                                    disabled={loading}
                                >
                                    <option value="Lista de Desejos">Lista de Desejos</option>
                                    <option value="Jogando">Jogando</option>
                                    <option value="Abandonado">Abandonado</option>
                                </select>
                            </div>
                        </div>

                        {game.platinum !== undefined && (
                            <div className="info-row">
                                <span className="info-label-new">Platinum:</span>
                                <span className="info-value-new">
                                    {game.platinum ? '✓ Conquistado' : '✗ Não conquistado'}
                                </span>
                            </div>
                        )}
                    </div>

                    <h3 className="section-subtitle mt-4">Detalhes do Jogo:</h3>
                    <div className="info-grid">
                        {(game.platforms || game.gameDetails?.plataformas) &&
                            (game.platforms?.length > 0 || game.gameDetails?.plataformas?.length > 0) && (
                                <div className="info-row">
                                    <span className="info-label-new">Plataformas:</span>
                                    <span className="info-value-new">
                                        {game.platforms?.join(', ') || game.gameDetails?.plataformas?.join(', ')}
                                    </span>
                                </div>
                            )}

                        {game.gameDetails?.genres && game.gameDetails.genres.length > 0 && (
                            <div className="info-row">
                                <span className="info-label-new">Gêneros:</span>
                                <span className="info-value-new">{game.gameDetails.genres.join(', ')}</span>
                            </div>
                        )}

                        {game.gameDetails?.ano_de_lancamento && (
                            <div className="info-row">
                                <span className="info-label-new">Ano de Lançamento:</span>
                                <span className="info-value-new">{game.gameDetails.ano_de_lancamento}</span>
                            </div>
                        )}

                        {game.gameDetails?.rating && (
                            <div className="info-row">
                                <span className="info-label-new">Avaliação:</span>
                                <span className="info-value-new">
                                    {game.gameDetails.rating.toFixed(2)} / 5.00
                                    {game.gameDetails.ratings_count && ` (${game.gameDetails.ratings_count.toLocaleString()} avaliações)`}
                                </span>
                            </div>
                        )}

                        {game.gameDetails?.playtime && (
                            <div className="info-row">
                                <span className="info-label-new">Tempo Médio:</span>
                                <span className="info-value-new">{game.gameDetails.playtime}h</span>
                            </div>
                        )}
                    </div>

                    {/* Botões de ação */}
                    <div className="action-buttons mt-4 d-flex flex-column align-items-center">
                        {hasChanges && (
                            <Button
                                variant="success"
                                onClick={handleSaveChanges}
                                disabled={loading}
                                className="w-100 mb-3"
                            >
                                <Save size={18} className="me-2" />
                                Salvar Alterações
                            </Button>
                        )}
                        <div className="d-flex gap-3 mb-3">
                            <Button
                                variant="outline-warning"
                                onClick={() => navigate('/add-trophy-games')}
                                className="trophy-icon-btn"
                                title="Adicionar Troféus"
                            >
                                <Trophy size={24} />
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleRemoveGame}
                                disabled={removing}
                            >
                                <Trash2 size={18} className="me-2" />
                                {removing ? 'Removendo...' : 'Remover da Biblioteca'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detalhes;