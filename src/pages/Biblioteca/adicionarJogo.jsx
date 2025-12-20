import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserLibrary, addGameToLibrary } from '../../app/thunks/libraryThunks';
import { fetchGenres } from '../../app/thunks/genreAndPlatformThunk';
import { InputGroup, Form, Button, Card, Badge, ListGroup, Alert } from 'react-bootstrap';
import LibraryStatus from '../../components/LibraryStatus';
import './adicionarJogo.css';

const AdicionarJogo = () => {
  const { register, handleSubmit, formState: { errors }, setError, reset, setValue } = useForm();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.library.loading);
  const library = useSelector((state) => state.library.library);
  const error = useSelector((state) => state.library.error);
  const availableGenres = useSelector((state) => state.genrePlatform?.genres || []);

  // const availablePlatforms = useSelector((state) => state.platforms.platforms || []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId: routeUserId } = useParams();

  useEffect(() => {
    const idToFetch = user?.id ?? 1;
    dispatch(fetchUserLibrary(idToFetch));
    dispatch(fetchGenres());
    //dispatch(fetchPlatforms());
  }, [dispatch]);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreInput, setGenreInput] = useState('');

  const filteredGenreSuggestions = genreInput.trim()
    ? availableGenres
      .filter(g => g.name.toLowerCase().includes(genreInput.toLowerCase()) && !selectedGenres.some(s => s.id === g.id))
      .slice(0, 8)
    : [];

  function handleSelectGenre(genre) {
    setSelectedGenres(prev => [...prev, genre]);
    setGenreInput('');
  }

  function handleRemoveGenre(id) {
    setSelectedGenres(prev => prev.filter(g => g.id !== id));
  }

  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setSubmitError(null);
    setSubmitting(true);

    const platforms = (data.platform || '').split(',').map(p => p.trim()).filter(Boolean);
    const genresForSave = selectedGenres.map(g => ({ id: g.id, name: g.name }));

    // Create a temporary game object for enrichment
    const gameData = {
      nome: data.game,
      backgroundimage: null,
      playtime: 0,
      genres: genresForSave,
    };

    // Use a temporary gameId (in production, you'd select from existing games or create new one)
    const tempGameId = String(Date.now());

    const result = await dispatch(addGameToLibrary(tempGameId, 'Jogando', gameData));

    setSubmitting(false);

    if (result.success) {
      reset();
      setSelectedGenres([]);
      setGenreInput('');
      setValue('platform', '');

      const targetUser = routeUserId ?? user?.id ?? 1;
      navigate(`/biblioteca/user/${targetUser}/detalhes/${result.data.id}`);
    } else {
      setSubmitError(result.error || 'Erro ao adicionar jogo à biblioteca');
    }
  }

  if (loading || error) {
    return (
      <LibraryStatus
        loading={loading}
        loadingMessage="Carregando jogos..."
        error={!!error}
        errorMessage={error}
        onRetry={() => dispatch(fetchUserLibrary(user?.id ?? routeUserId ?? 1))}
        errorTitle="Erro ao carregar jogos da biblioteca"
      />
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '40px' }}>
      <Card className="bg-dark-custom shadow-lg" style={{ maxWidth: '500px', width: '100%', border: '1px solid #333', borderRadius: '15px' }}>
        <Card.Body className="p-4">
          <h2 className="mb-2 text-center text-white">Adicionar Jogo</h2>
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

            <Form.Group className="mb-4" controlId="formGamePlatform">
              <Form.Label className="text-light">Plataforma do Jogo</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Ex: PlayStation 5, PC"
                  className="bg-dark text-white border-secondary custom-placeholder"
                  {...register('platform', { required: 'No mínimo uma plataforma é obrigatória' })}
                  isInvalid={!!errors.platform}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.platform?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div className="d-flex gap-2">
              <Link to={routeUserId ? `/biblioteca/user/${routeUserId}` : `/biblioteca/user/${user?.id ?? 1}`} className="w-100">
                <Button
                  variant="outline-secondary"
                  className='w-100'
                  disabled={submitting}
                >
                  Voltar
                </Button>
              </Link>
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
        </Card.Body>
      </Card>
    </div>
  );

};
export default AdicionarJogo;