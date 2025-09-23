
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
            <Container className="mt-5 pt-5">
                <Row className="justify-content-center">
                    <Col xs={12} className="text-center py-5">
                        <h2 className="text-white mb-4">Jogo não encontrado</h2>
                        <Button
                            variant="outline-light"
                            onClick={() => navigate('/biblioteca')}
                        >
                            <ArrowLeft size={18} className="me-2" />
                            Voltar para Biblioteca
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="mt-5 pt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    <Card className="bg-dark text-white border-secondary mb-4">
                        <Row className="g-0">
                            <Col xs={12} md={4} className="d-flex align-items-center justify-content-center p-4">
                                <img
                                    src={game.img}
                                    alt={game.name}
                                    className="game-image rounded"
                                />
                            </Col>
                            <Col xs={12} md={8}>
                                <Card.Body className="h-100 d-flex flex-column justify-content-center">
                                    <h1 className="h3 fw-bold mb-4 text-center text-md-start">
                                        {game.name}
                                    </h1>
                                    <div className="mb-3">
                                        <Row className="text-center text-md-start">
                                            <Col xs={12} sm={6} className="mb-2">
                                                <span className="info-label">Status:</span>
                                                <span className="fw-bold ms-2">{game.status || '-'}</span>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <span className="info-label">Progresso:</span>
                                                <span className="fw-bold ms-2">{game.progresso || '-'}</span>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                    
                    <Row className="justify-content-center">
                        <Col xs={12} className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                            <Button
                                variant="outline-light"
                                onClick={() => navigate('/biblioteca')}
                                className="d-flex align-items-center justify-content-center"
                                style={{ minWidth: '200px' }}
                            >
                                <ArrowLeft size={18} className="me-2" />
                                Voltar para Biblioteca
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleRemoveGame}
                                className="d-flex align-items-center justify-content-center"
                                style={{ minWidth: '200px' }}
                            >
                                <Trash2 size={18} className="me-2" />
                                Remover da Biblioteca
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Detalhes;