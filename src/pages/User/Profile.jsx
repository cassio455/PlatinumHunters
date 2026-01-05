import { Image, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../app/slices/authSlice';
import { clearLibrary } from '../../app/slices/librarySlice';
import { clearTrophies } from '../../app/slices/trophySlice';
import { fetchUserProfile } from '../../app/thunks/authThunks';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LibraryStatus from '../../components/LibraryStatus';
import { Trophy, Gamepad2, Clock, Star, ListChecks } from 'lucide-react';
import './auth.css';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const statistics = useSelector((state) => state.auth.statistics);
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);

    useEffect(() => {
        // Fetch user profile with statistics from /users/me
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const handleLogout = () => {
        // Limpar todos os dados do Redux antes de fazer logout
        dispatch(clearLibrary());
        dispatch(clearTrophies());
        dispatch(logout());

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/user/login');
    };

    if (loading) {
        return (
            <LibraryStatus
                loading={loading}
                loadingMessage="Carregando perfil..."
                error={!!error}
                errorMessage={error}
                onRetry={() => dispatch(fetchUserProfile())}
                errorTitle="Erro ao carregar perfil"
            />
        );
    }

    return (
        <Container className="py-5 profile-container" style={{ minHeight: '80vh', paddingTop: '100px' }}>
            <div className="section-header mb-5">
                <h1 className="section-title text-center mb-2 text-white">Meu Perfil</h1>
                <div className="section-line" style={{ margin: '0 auto', maxWidth: 400 }}></div>
            </div>

            <Row className="justify-content-center align-items-start mt-4">
                <Col xs={12} md={8} lg={6} className="d-flex justify-content-center">
                    <Card className="p-4 w-100 h-100 text-center bg-dark-custom shadow-lg" style={{ maxWidth: 620, minWidth: 320, border: '1px solid #333', borderRadius: '15px' }}>
                        <Card.Body>
                            <div
                                className="d-inline-block rounded-circle mb-3"
                                style={{
                                    border: '3px solid #fa5f69',
                                    boxShadow: '0 0 15px rgba(250, 95, 105, 0.3)',
                                    padding: '3px'
                                }}
                            >
                                <Image
                                    src={user?.profileImageUrl || "https://i.pravatar.cc/100?img=3"}
                                    roundedCircle
                                    alt="User Avatar"
                                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                                />
                            </div>
                            <h3 className="text-white">{user?.username || 'Usuário'}</h3>
                            {user?.equippedTitle ? (
                                <p className="mb-1" style={{ color: '#ffd700', fontSize: '1rem', fontWeight: '500' }}>
                                    {user.equippedTitle}
                                </p>
                            ) : (
                                <p className="text-secondary small mb-1">Nenhum título equipado</p>
                            )}
                            <p className="mb-4" style={{ color: '#fa5f69', fontSize: '0.9rem' }}>Suas estatísticas</p>

                            <Row className="mb-4 g-3">
                                <Col xs={6} md={4} className="stat-card-animated">
                                    <Card className="text-center stat-card-dark" style={{ border: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                                        <Card.Body className="py-3">
                                            <Trophy size={24} color="#fa5f69" />
                                            <h4 className="mb-0 mt-2 text-white">{statistics?.totalPlatinum || 0}</h4>
                                            <small className="text-secondary">Platinados</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={6} md={4} className="stat-card-animated">
                                    <Card className="text-center stat-card-dark" style={{ border: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                                        <Card.Body className="py-3">
                                            <Gamepad2 size={24} color="#fa5f69" />
                                            <h4 className="mb-0 mt-2 text-white">{statistics?.totalPlaying || 0}</h4>
                                            <small className="text-secondary">Jogando</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={6} md={4} className="stat-card-animated">
                                    <Card className="text-center stat-card-dark" style={{ border: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                                        <Card.Body className="py-3">
                                            <ListChecks size={24} color="#fa5f69" />
                                            <h4 className="mb-0 mt-2 text-white">{statistics?.totalCompleted || 0}</h4>
                                            <small className="text-secondary">Completos</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={6} md={4} className="stat-card-animated">
                                    <Card className="text-center stat-card-dark" style={{ border: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                                        <Card.Body className="py-3">
                                            <Gamepad2 size={24} color="#fa5f69" />
                                            <h4 className="mb-0 text-white">{statistics?.totalGamesInLibrary || 0}</h4>
                                            <small className="text-secondary">Na Biblioteca</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={6} md={4} className="stat-card-animated">
                                    <Card className="text-center stat-card-dark" style={{ border: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                                        <Card.Body className="py-3">
                                            <Clock size={24} color="#fa5f69" />
                                            <h4 className="mb-0 mt-2 text-white">{statistics?.totalHoursPlayed?.toFixed(1) || 0}h</h4>
                                            <small className="text-secondary">Jogadas</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={6} md={4} className="stat-card-animated">
                                    <Card className="text-center stat-card-dark" style={{ border: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                                        <Card.Body className="py-3">
                                            <Star size={24} color="#fa5f69" />
                                            <h4 className="mb-0 mt-2 text-white">{statistics?.averageProgress?.toFixed(1) || 0}%</h4>
                                            <small className="text-secondary">Progresso Médio</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <div className="d-flex gap-2 justify-content-center flex-wrap">
                                <Button
                                    variant="primary"
                                    onClick={() => navigate(`/biblioteca/user/${user?.id}`)}
                                    style={{
                                        backgroundColor: '#fa5f69',
                                        borderColor: '#fa5f69',
                                        boxShadow: '0 4px 15px rgba(250, 95, 105, 0.4)'
                                    }}
                                >
                                    Biblioteca
                                </Button>
                                <Button
                                    variant="info"
                                    onClick={() => navigate('/shop')}
                                >
                                    Títulos
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;