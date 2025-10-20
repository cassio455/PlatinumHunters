import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserLibrary } from '../../app/thunks/libraryThunks';
import { fetchGenres } from '../../app/thunks/genreAndPlatformThunk';
import { addToLibrary } from '../../app/slices/librarySlice';
import { InputGroup, Form, Button, Card, Badge, ListGroup } from 'react-bootstrap';
import LibraryStatus from '../../components/LibraryStatus';
import './adicionarJogo.css';

const AdicionarJogo = () => {
  const { register, handleSubmit, formState: { errors }, setError, reset, setValue } = useForm();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.library.loading);
  const library = useSelector((state) => state.library.library);
  const error = useSelector((state) => state.library.error);
  const availableGenres = useSelector((state) => state.genres.genres || []);

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

  const onSubmit = (data) => {
    const platforms = (data.platform || '').split(',').map(p => p.trim()).filter(Boolean);
    const genresForSave = selectedGenres.map(g => ({ id: g.id, name: g.name }));
    const payload = {
      id: Date.now(),
      userId: user?.id ?? 1,
      gameId: Date.now(),
      name: data.game,
      img: null,
      status: 'owned',
      progress: 0,
      playTime: 0,
      rating: null,
      dateAdded: new Date().toISOString(),
      platforms,
      genres: genresForSave,
    };

    payload.userId = user?.id ?? payload.userId;
    dispatch(addToLibrary(payload));
    reset();
    setSelectedGenres([]);
    setGenreInput('');
    setValue('platform', '');

    const { userId } = useParams();
    const targetUser = userId ?? user?.id ?? 1;
    navigate(`/biblioteca/user/${targetUser}/detalhes/${payload.id}`);
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
    <Card className="d-flex align-items-center justify-content-center mx-auto" style={{ minHeight: '80vh', maxWidth: '450px', width: '100%', marginTop: '5vh' }}>
      <Card.Body className="p-4 w-100">
        <h2 className="mb-4 text-center">Adicionar jogo a biblioteca</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formGameName">
            <Form.Label>Nome do Jogo</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Digite o nome do jogo"
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
            <Form.Label>Gêneros do Jogo</Form.Label>
            <div className="mb-2">
              {selectedGenres.map(g => (
                <Badge key={g.id || g.name} bg="secondary" className="me-1">
                  {g.name} <span style={{ cursor: 'pointer' }} onClick={() => handleRemoveGenre(g.id)}>×</span>
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
              <ListGroup className="mt-1 position-relative" style={{ zIndex: 2000 }}>
                {filteredGenreSuggestions.map(g => (
                  <ListGroup.Item key={g.id} action onClick={() => handleSelectGenre(g)}>
                    {g.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
            <Form.Text className="info-text">Selecione um ou mais gêneros pela lista (filtrada).</Form.Text>
            <Form.Control type="hidden" {...register('genres', { validate: () => selectedGenres.length > 0 || 'No mínimo um gênero é obrigatório' })} value={selectedGenres.map(g => g.id).join(',')} />
            <Form.Control.Feedback type="invalid">
              {errors.genres?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGamePlatform">
            <Form.Label>Plataforma do Jogo</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Digite a plataforma do jogo"
                className="bg-dark text-white border-secondary custom-placeholder"
                {...register('platform', { required: 'No mínimo uma plataforma é obrigatória' })}
                isInvalid={!!errors.platform}
              />
              <Form.Control.Feedback type="invalid">
                {errors.platform?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <div className="d-flex flex-column flex-md-row gap-2">
            <Link to={routeUserId ? `/biblioteca/user/${routeUserId}` : `/biblioteca/user/${user?.id ?? 1}`} className="w-100">
              <Button variant="outline-light" className='w-100 mb-0'>Voltar à Biblioteca</Button>
            </Link>
            <Button variant="outline-light" type="submit" className='w-100'>Adicionar localmente</Button>
          </div>
        </Form>
      </Card.Body>
    </Card >
  );

};
export default AdicionarJogo;