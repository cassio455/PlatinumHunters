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
        <Container className="py-5 profile-container" style={{ minHeight: '80vh' }}>
            <div className="section-header mb-4">
                <h1 className="section-title text-center mb-2">Meu Perfil</h1>
                <div className="section-line" style={{ margin: '0 auto', maxWidth: 400 }}></div>
            </div>

            <Row className="justify-content-center align-items-start mt-4">
                <Col xs={12} md={8} lg={6} className="d-flex justify-content-center">
                    <Card className="p-4 w-100 h-100 text-center bg-dark-custom" style={{ maxWidth: 620, minWidth: 320 }}>
                        <Card.Body>
                            <Image
                                src={user?.profileImageUrl || "https://i.pravatar.cc/100?img=3"}
                                roundedCircle
                                className="mb-3"
                                alt="User Avatar"
                                style={{ width: 100, height: 100, objectFit: 'cover' }}
                            />
                            <h3>{user?.username || 'Usuário'}</h3>
                            <p className="text-muted small">{user?.email}</p>
                            <p className="mb-3 info-text">Suas estatísticas</p>

                            <Row className="mb-3 g-3">
                                <Col>
                                    <Card className="text-center stat-card-dark">
                                        <Card.Body>
                                            <Trophy size={20} />
                                            <h4 className="mb-0 mt-2">{stats.platinado}</h4>
                                            <small>Platinados</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card className="text-center stat-card-dark">
                                        <Card.Body>
                                            <Gamepad2 size={20} />
                                            <h4 className="mb-0 mt-2">{stats.jogando}</h4>
                                            <small>Jogando</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card className="text-center stat-card-dark">
                                        <Card.Body>
                                            <h4 className="mb-0">{stats.total}</h4>
                                            <small>Jogos</small>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <div className="d-flex gap-2 justify-content-center">
                                <Button variant="primary" onClick={() => navigate(`/biblioteca/user/${user?.id || 1}`)}>Ir à Biblioteca</Button>
                                <Button variant="outline-primary" onClick={() => navigate('/shop')}>Títulos</Button>
                                <Button variant="secondary" onClick={handleLogout}>Sair</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;