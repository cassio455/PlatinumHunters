import { Image, Button, Container, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../app/slices/authSlice';
import { fetchUserLibrary } from '../../app/thunks/libraryThunks';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LibraryStatus from '../../components/LibraryStatus';
import { ChevronRight, ChevronLeft, Search, Trophy, Gamepad2, Star } from 'lucide-react';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const name = useSelector((state) => state.auth.user?.name);

    const stats = useSelector((state) => state.library.stats);
    const library = useSelector((state) => state.library.library);
    const loading = useSelector((state) => state.library.loading);
    const error = useSelector((state) => state.library.error);

    useEffect(() => {
        dispatch(fetchUserLibrary(1));
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        navigate('/user/login');
    };

    const platinumGames = library.filter(game => game.status === 'platinado');
    const playingGames = library.filter(game => game.status === 'jogando');

    const renderStarRating = (rating) => {
        if (!rating) return null;
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={12}
                    fill={i <= rating ? "#ffc107" : "none"}
                    color={i <= rating ? "#ffc107" : "#ccc"}
                />
            );
        }
        return <div className="d-flex gap-1">{stars}</div>;
    };

    const [page, setPage] = useState(0);
    const pageSize = 5;
    const totalPages = Math.ceil(platinumGames.length / pageSize);
    const paginatedGames = platinumGames.slice(page * pageSize, (page + 1) * pageSize);

    if (loading || error) {
        return (
            <LibraryStatus
                loading={loading}
                loadingMessage="Carregando itens..."
                error={!!error}
                errorMessage={error}
                onRetry={() => dispatch(fetchUserLibrary(1))}
                errorTitle="Erro ao carregar jogos"
            />
        );
    }

    return (
        <Container className="py-5" style={{ minHeight: '80vh' }}>
            <div className="section-header mb-4">
                <h1 className="section-title text-center mb-2">Meu Perfil</h1>
                <div className="section-line" style={{ margin: '0 auto', maxWidth: 400 }}></div>
            </div>

            <Row className="justify-content-center align-items-start mt-4" style={{ gap: 24 }}>
                {/* Card de Perfil */}
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
                                <p className="mb-4 text-muted">
                                    {stats.total} jogos na biblioteca
                                </p>
                            </div>

                            {/* Estatísticas */}
                            <Row className="mb-3 g-2">
                                <Col xs={6}>
                                    <Card bg="success" text="white" className="text-center">
                                        <Card.Body className="py-2">
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                <Trophy size={18} />
                                                <div>
                                                    <h4 className="mb-0">{stats.platinado}</h4>
                                                    <small>Platinados</small>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={6}>
                                    <Card bg="primary" text="white" className="text-center">
                                        <Card.Body className="py-2">
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                <Gamepad2 size={18} />
                                                <div>
                                                    <h4 className="mb-0">{stats.jogando}</h4>
                                                    <small>Jogando</small>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <div className="mt-4">
                                <Button variant="primary" className="me-2">Editar Perfil</Button>
                                <Button variant="secondary" onClick={handleLogout}>Sair</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Card de Jogos Platinados */}
                <Col xs={12} md={6} lg={5} className="d-flex justify-content-center">
                    <Card className="w-100 h-100" style={{ maxWidth: 500, minWidth: 320 }}>
                        <Card.Header className="d-flex align-items-center justify-content-between">
                            <span>🏆 Jogos Platinados ({platinumGames.length})</span>
                        </Card.Header>
                        <ListGroup variant="flush" style={{ minHeight: '200px' }}>
                            {paginatedGames.length === 0 ? (
                                <ListGroup.Item className="text-center text-muted py-5">
                                    Nenhum jogo platinado ainda
                                </ListGroup.Item>
                            ) : (
                                paginatedGames.map((game, idx) => (
                                    <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex flex-column">
                                            <span>{game.name}</span>
                                            <div className="d-flex align-items-center gap-2 mt-1">
                                                {renderStarRating(game.rating)}
                                                {game.platforms && game.platforms.length > 0 && (
                                                    <div className="d-flex gap-1">
                                                        {game.platforms.slice(0, 2).map((platform, i) => (
                                                            <Badge key={i} bg="secondary" style={{ fontSize: '0.7rem' }}>
                                                                {platform}
                                                            </Badge>
                                                        ))}
                                                        {game.platforms.length > 2 && (
                                                            <Badge bg="light" text="dark" style={{ fontSize: '0.7rem' }}>
                                                                +{game.platforms.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span style={{ fontSize: 13, color: '#aaa' }}>{game.progresso}</span>
                                    </ListGroup.Item>
                                ))
                            )}
                        </ListGroup>
                        {platinumGames.length > 0 && (
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
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Jogos em Andamento */}
            {playingGames.length > 0 && (
                <Row className="mt-5 justify-content-center">
                    <Col xs={12} lg={10}>
                        <h3 className="text-center mb-4">🎮 Jogando Agora ({playingGames.length})</h3>
                        <div className="row g-3">
                            {playingGames.map((game) => (
                                <div key={game.id} className="col-6 col-md-4 col-lg-3">
                                    <Card bg="dark" text="white" className="h-100">
                                        <Card.Img
                                            variant="top"
                                            src={game.img}
                                            alt={game.name}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <Card.Body className="p-2">
                                            <Card.Title style={{ fontSize: '0.9rem' }}>{game.name}</Card.Title>
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <Card.Text className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                                                    {game.progresso}
                                                </Card.Text>
                                                {renderStarRating(game.rating)}
                                            </div>
                                            {game.platforms && game.platforms.length > 0 && (
                                                <div className="d-flex gap-1 flex-wrap">
                                                    {game.platforms.slice(0, 2).map((platform, i) => (
                                                        <Badge key={i} bg="info" style={{ fontSize: '0.6rem' }}>
                                                            {platform}
                                                        </Badge>
                                                    ))}
                                                    {game.platforms.length > 2 && (
                                                        <Badge bg="light" text="dark" style={{ fontSize: '0.6rem' }}>
                                                            +{game.platforms.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default Profile;