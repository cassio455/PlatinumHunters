
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Card, InputGroup, Form, Button, Badge, ListGroup, Alert, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserLibrary, addGameToLibrary } from '../../app/thunks/libraryThunks';
import { fetchGenres, fetchPlatforms } from '../../app/thunks/genreAndPlatformThunk';
import { useForm } from 'react-hook-form';
import LibraryStatus from '../../components/LibraryStatus';
import './index.css';

const Biblioteca = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const dispatch = useDispatch();
  const library = useSelector((state) => state.library.library);
  const loading = useSelector((state) => state.library.loading);
  const error = useSelector((state) => state.library.error);
  const user = useSelector((state) => state.auth.user);
  const availableGenres = useSelector((state) => state.genrePlatform?.genres || []);
  const availablePlatforms = useSelector((state) => state.genrePlatform?.platforms || []);

  const { userId: routeUserId } = useParams();

  // Estados para o modal de adicionar jogo
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreInput, setGenreInput] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [platformInput, setPlatformInput] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch library without userId - backend uses auth token
    dispatch(fetchUserLibrary());
    dispatch(fetchGenres());
    dispatch(fetchPlatforms());
  }, [dispatch]);

  const filteredGames = library.filter(game => {
    const matchesSearch = game.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredGenreSuggestions = genreInput.trim()
    ? availableGenres
      .filter(g => g.name.toLowerCase().includes(genreInput.toLowerCase()) && !selectedGenres.some(s => s.id === g.id))
      .slice(0, 8)
    : [];

  const filteredPlatformSuggestions = platformInput.trim()
    ? availablePlatforms
      .filter(p => p.name.toLowerCase().includes(platformInput.toLowerCase()) && !selectedPlatforms.some(s => s.id === p.id))
      .slice(0, 8)
    : [];

  const handleSelectGenre = (genre) => {
    setSelectedGenres(prev => [...prev, genre]);
    setGenreInput('');
  };

  const handleRemoveGenre = (id) => {
    setSelectedGenres(prev => prev.filter(g => g.id !== id));
  };

  const handleSelectPlatform = (platform) => {
    setSelectedPlatforms(prev => [...prev, platform]);
    setPlatformInput('');
  };

  const handleRemovePlatform = (id) => {
    setSelectedPlatforms(prev => prev.filter(p => p.id !== id));
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    reset();
    setSelectedGenres([]);
    setGenreInput('');
    setSelectedPlatforms([]);
    setPlatformInput('');
    setSubmitError(null);
  };

  const onSubmit = async (data) => {
    setSubmitError(null);
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const genresArray = selectedGenres.map(g => g.name);
      const platformsArray = selectedPlatforms.map(p => p.name);

      // Criar custom game
      const response = await fetch('http://localhost:3000/library/custom-games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: data.game,
          backgroundimage: data.imageUrl?.trim() || undefined,
          plataformas: platformsArray.length > 0 ? platformsArray : undefined,
          genres: genresArray.length > 0 ? genresArray : undefined,
          description: data.description?.trim() || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar jogo customizado');
      }

      const result = await response.json();
      const customGameId = result.data._id;

      // Adicionar à biblioteca com o UUID correto
      // Para custom games, não passar gameData para evitar update otimista com ID errado
      const addResult = await dispatch(addGameToLibrary(customGameId, 'Jogando', null));

      if (!addResult.success) {
        throw new Error(addResult.error || 'Erro ao adicionar jogo à biblioteca');
      }

      handleCloseModal();
      // Recarregar biblioteca para pegar os dados corretos do backend
      await dispatch(fetchUserLibrary());
    } catch (error) {
      setSubmitError(error.message || 'Erro ao adicionar jogo à biblioteca');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || error) {
    return (
      <LibraryStatus
        loading={loading}
        loadingMessage="Carregando biblioteca..."
        error={!!error}
        errorMessage={error}
        onRetry={() => dispatch(fetchUserLibrary({}, true))}
        errorTitle="Erro ao carregar biblioteca"
      />
    );
  }

  return (
    <div className="main-page container mt-5 pt-5">
      <div className="section-header mb-4">
        <h1 className="title-text mb-2">Minha Biblioteca</h1>
        <div className="section-line mb-3"></div>
        <p className="page-subtitle mb-4">Gerencie seus jogos e acompanhe seu progresso</p>
        <div className="search-bar-biblioteca gap-3">
          <div style={{ width: '100%', maxWidth: 400 }}>
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
          <div className="d-flex justify-content-end">
            <Button onClick={() => setShowAddModal(true)} variant="outline-light" className="add-game-btn">
              Adicionar novo jogo
            </Button>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        {filteredGames.length === 0 && (
          <div className="col-12 text-center text-muted">Nenhum jogo encontrado.</div>
        )}
        {filteredGames.map((game) => (
          <div className="col-6 col-md-4 col-lg-3 mb-4" key={game.id}>
            <Link to={`/biblioteca/user/${routeUserId ?? 1}/detalhes/${game.id}`} style={{ textDecoration: 'none' }}>
              <Card className="game-card-biblioteca bg-dark text-white position-relative">
                <Card.Img
                  src={game.img || 'https://via.placeholder.com/400x225/1a1a1a/666666?text=Sem+Imagem'}
                  alt={game.name}
                  className="game-card-img-biblioteca"
                />
                <div className="overlay-biblioteca">
                  <h5 className="game-title-biblioteca">{game.name}</h5>
                  <div className="mt-1">
                    <small className="text-muted">{game.progresso}</small>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {/* Modal para Adicionar Jogo */}
      <Modal show={showAddModal} onHide={handleCloseModal} centered size="lg" contentClassName="bg-dark text-white">
        <Modal.Header style={{ borderBottom: '1px solid #333', position: 'relative' }} className="justify-content-center">
          <Modal.Title className="w-100 text-center">Adicionar Jogo</Modal.Title>
          <Button
            variant="link"
            onClick={handleCloseModal}
            className="text-white p-0 position-absolute"
            style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }}
          >
            <X size={24} />
          </Button>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="text-center text-secondary mb-4">Adicione um novo jogo à sua biblioteca</p>

          {submitError && (
            <Alert variant="danger" dismissible onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formGameName">
              <Form.Label className="text-light">Nome do Jogo</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Ex: The Last of Us"
                  className="bg-dark text-white border-secondary custom-placeholder"
                  {...register('game', { required: 'Nome obrigatório' })}
                  isInvalid={!!errors.game}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.game?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGameGenre">
              <Form.Label className="text-light">Gêneros do Jogo</Form.Label>
              <div className="mb-2">
                {selectedGenres.map(g => (
                  <Badge
                    key={g.id || g.name}
                    bg="dark"
                    className="me-1 mb-1"
                    style={{
                      border: '1px solid #fa5f69',
                      color: '#fa5f69',
                      cursor: 'pointer'
                    }}
                  >
                    {g.name} <span onClick={() => handleRemoveGenre(g.id)}>×</span>
                  </Badge>
                ))}
              </div>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Digite para buscar gêneros"
                  className="bg-dark text-white border-secondary custom-placeholder"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                />
              </InputGroup>

              {filteredGenreSuggestions.length > 0 && (
                <ListGroup className="mt-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {filteredGenreSuggestions.map(g => (
                    <ListGroup.Item
                      key={g.id}
                      action
                      onClick={() => handleSelectGenre(g)}
                      className="bg-dark text-white border-secondary"
                      style={{ cursor: 'pointer' }}
                    >
                      {g.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              <Form.Text className="text-secondary">Selecione um ou mais gêneros pela lista.</Form.Text>
              <Form.Control type="hidden" {...register('genres', { validate: () => selectedGenres.length > 0 || 'No mínimo um gênero é obrigatório' })} value={selectedGenres.map(g => g.id).join(',')} />
              {errors.genres && (
                <div className="text-danger small mt-1">{errors.genres?.message}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGamePlatform">
              <Form.Label className="text-light">Plataformas do Jogo</Form.Label>
              <div className="mb-2">
                {selectedPlatforms.map(p => (
                  <Badge
                    key={p.id || p.name}
                    bg="dark"
                    className="me-1 mb-1"
                    style={{
                      border: '1px solid #fa5f69',
                      color: '#fa5f69',
                      cursor: 'pointer'
                    }}
                  >
                    {p.name} <span onClick={() => handleRemovePlatform(p.id)}>×</span>
                  </Badge>
                ))}
              </div>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Digite para buscar plataformas (ex: PS4, PC)"
                  className="bg-dark text-white border-secondary custom-placeholder"
                  value={platformInput}
                  onChange={(e) => setPlatformInput(e.target.value)}
                />
              </InputGroup>

              {filteredPlatformSuggestions.length > 0 && (
                <ListGroup className="mt-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {filteredPlatformSuggestions.map(p => (
                    <ListGroup.Item
                      key={p.id}
                      action
                      onClick={() => handleSelectPlatform(p)}
                      className="bg-dark text-white border-secondary"
                      style={{ cursor: 'pointer' }}
                    >
                      {p.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              <Form.Text className="text-secondary">Selecione uma ou mais plataformas pela lista.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGameImage">
              <Form.Label className="text-light">URL da Imagem (opcional)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="bg-dark text-white border-secondary custom-placeholder"
                  {...register('imageUrl')}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formGameDescription">
              <Form.Label className="text-light">Descrição (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Descreva o jogo..."
                className="bg-dark text-white border-secondary custom-placeholder"
                {...register('description')}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                className='w-100'
                disabled={submitting}
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                className='w-100'
                disabled={submitting}
                style={{
                  backgroundColor: '#fa5f69',
                  borderColor: '#fa5f69',
                  boxShadow: '0 4px 15px rgba(250, 95, 105, 0.4)'
                }}
              >
                {submitting ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div >
  );
};


export default Biblioteca;