import { Image, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../app/slices/authSlice';
import { fetchUserLibrary } from '../../app/thunks/libraryThunks';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LibraryStatus from '../../components/LibraryStatus';
import { Trophy, Gamepad2 } from 'lucide-react';
import './auth.css';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const stats = useSelector((state) => state.library?.stats || { total: 0, platinado: 0, jogando: 0 });
    const library = useSelector((state) => state.library?.library || []);
    const loading = useSelector((state) => state.library?.loading || false);
    const error = useSelector((state) => state.library?.error);

    useEffect(() => {
        // Fetch library without userId - backend uses auth token
        dispatch(fetchUserLibrary());
    }, [dispatch]);

    const handleLogout = () => {
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
                onRetry={() => dispatch(fetchUserLibrary({}, true))}
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
                            <p className="text-white small mb-1">Seu Título</p>
                            <p className="mb-4" style={{ color: '#fa5f69', fontSize: '0.9rem' }}>Suas estatísticas</p>

                            <Row className="mb-4 g-3">
                                <Col>
                                    <Card className="text-center stat-card-dark" style={{ border: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                                        <Card.Body className="py-3">
                                            <Trophy size={24} color="#fa5f69" />
                                            <h4 className="mb-0 mt-2 text-white">{stats.platinado}</h4>
                                            <small className="text-secondary">Platinados</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card className="text-center stat-card-dark" style={{ border: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                                        <Card.Body className="py-3">
                                            <Gamepad2 size={24} color="#fa5f69" />
                                            <h4 className="mb-0 mt-2 text-white">{stats.jogando}</h4>
                                            <small className="text-secondary">Jogando</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card className="text-center stat-card-dark" style={{ border: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                                        <Card.Body className="py-3">
                                            <Gamepad2 size={24} color="#fa5f69" />
                                            <h4 className="mb-0 text-white">{stats.total}</h4>
                                            <small className="text-secondary">Jogos</small>
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
                                    Ir à Biblioteca
                                </Button>
                                <Button
                                    variant="outline-light"
                                    onClick={() => navigate('/shop')}
                                    style={{ borderColor: '#fa5f69', color: '#fa5f69' }}
                                >
                                    Títulos
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleLogout}
                                >
                                    Sair
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