import { Image, Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../app/slices/authSlice';
import { clearCurrentUser } from '../../app/slices/shopSlice'; 
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { MOCK_USER } from './userMock';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const name = useSelector((state) => state.auth.user?.name);

    const handleLogout = () => {
        dispatch(clearCurrentUser());
        dispatch(logout());
        localStorage.removeItem('token');
        navigate('/user/login');
    };

    const platinumGames = MOCK_USER.platinumGames || [];
    const [page, setPage] = useState(0);
    const pageSize = 10;
    const totalPages = Math.ceil(platinumGames.length / pageSize);
    const paginatedGames = platinumGames.slice(page * pageSize, (page + 1) * pageSize);

    return (
        <Container className="py-5" style={{ minHeight: '80vh' }}>
            <div className="section-header mb-4">
                <h1 className="section-title text-center mb-2">Minha Biblioteca</h1>
                <div className="section-line" style={{ margin: '0 auto', maxWidth: 400 }}></div>
            </div>
            <Row className="justify-content-center align-items-start mt-4" style={{ gap: 24 }}>
                <Col xs={12} md={6} lg={5} className="d-flex justify-content-center mb-4 mb-md-0">
                    <Card className="p-4 w-100 h-100" style={{ maxWidth: 500, minWidth: 320 }}>
                        <Card.Body>
                            <div className="d-flex flex-column align-items-center">
                                <Image
                                    src="https://i.pravatar.cc/100?img=3"
                                    roundedCircle
                                    className="mb-3"
                                    alt="User Avatar"
                                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                                />
                                <h3>{name}</h3>
                                <p className="mb-4 text-white">
                                    64 jogos platinados
                                </p>
                            </div>
                            <div>
                                <Button variant="primary" className="me-2">Editar Perfil</Button>
                                <Button variant="secondary" onClick={handleLogout}>Sair</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={6} lg={5} className="d-flex justify-content-center">
                    <Card className="w-100 h-100" style={{ maxWidth: 500, minWidth: 320 }}>
                        <Card.Header className="d-flex align-items-center justify-content-between">
                            <span>Jogos Platinados</span>
                            <Button variant="link" size="sm"><Search size={18} /></Button>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {paginatedGames.map((game, idx) => (
                                <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                                    <span>{game.name}</span>
                                    <span style={{ fontSize: 13, color: '#aaa' }}>{new Date(game.date).toLocaleDateString('pt-BR')}</span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <Card.Footer className="d-flex justify-content-between align-items-center">
                            <Button
                                variant="link"
                                size="sm"
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                aria-label="Anterior"
                            >
                                <ChevronLeft size={20} />
                            </Button>
                            <span style={{ fontSize: 14 }}>Página {page + 1} de {totalPages}</span>
                            <Button
                                variant="link"
                                size="sm"
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(page + 1)}
                                aria-label="Próxima"
                            >
                                <ChevronRight size={20} />
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;