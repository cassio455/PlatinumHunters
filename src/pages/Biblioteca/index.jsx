
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { Card, InputGroup, Form, Button, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserLibrary } from '../../app/thunks/libraryThunks';
import LibraryStatus from '../../components/LibraryStatus';
import './index.css';

const Biblioteca = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');

  const dispatch = useDispatch();
  const library = useSelector((state) => state.library.library);
  const loading = useSelector((state) => state.library.loading);
  const error = useSelector((state) => state.library.error);

  useEffect(() => {
    dispatch(fetchUserLibrary(1));
  }, [dispatch]);

  // Helper function to render star rating
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

  const filteredGames = library.filter(game => {
    const matchesSearch = game.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || game.status === statusFilter;
    const matchesPlatform = !platformFilter || (game.platforms && game.platforms.includes(platformFilter));
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const allPlatforms = [...new Set(library.flatMap(game => game.platforms || []))];

  if (loading || error) {
    return (
      <LibraryStatus
        loading={loading}
        loadingMessage="Carregando biblioteca..."
        error={!!error}
        errorMessage={error}
        onRetry={() => dispatch(fetchUserLibrary(1))}
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
            <Button as={Link} to="/biblioteca/adicionar" variant="outline-light" className="add-game-btn">
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
            <Link to={`/biblioteca/detalhes/${game.id}`} style={{ textDecoration: 'none' }}>
              <Card className="game-card-biblioteca bg-dark text-white position-relative">
                <Card.Img src={game.img} alt={game.name} className="game-card-img-biblioteca" />
                <div className="overlay-biblioteca">
                  <h5 className="game-title-biblioteca">{game.name}</h5>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <Badge bg={game.status === 'platinado' ? 'success' : game.status === 'jogando' ? 'primary' : 'secondary'}>
                      {game.status}
                    </Badge>
                    {renderStarRating(game.rating)}
                  </div>
                  <div className="mt-1">
                    <small className="text-muted">{game.progresso}</small>
                  </div>
                  {game.platforms && game.platforms.length > 0 && (
                    <div className="d-flex gap-1 mt-1 flex-wrap">
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
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      <div className="filters-section mt-5">
        <h5 className="filters-title mb-3">Filtros</h5>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          <button
            className={`btn ${statusFilter === '' ? 'btn-light' : 'btn-outline-light'} filter-btn`}
            onClick={() => setStatusFilter('')}
          >
            Todos
          </button>
          <button
            className={`btn ${statusFilter === 'jogando' ? 'btn-primary' : 'btn-outline-light'} filter-btn`}
            onClick={() => setStatusFilter('jogando')}
          >
            Jogando
          </button>
          <button
            className={`btn ${statusFilter === 'platinado' ? 'btn-success' : 'btn-outline-light'} filter-btn`}
            onClick={() => setStatusFilter('platinado')}
          >
            Platinado
          </button>
          <button
            className={`btn ${statusFilter === 'concluido' ? 'btn-info' : 'btn-outline-light'} filter-btn`}
            onClick={() => setStatusFilter('concluido')}
          >
            Concluído
          </button>
          <button
            className={`btn ${statusFilter === 'desejo' ? 'btn-warning' : 'btn-outline-light'} filter-btn`}
            onClick={() => setStatusFilter('desejo')}
          >
            Lista de Desejos
          </button>
        </div>

        {allPlatforms.length > 0 && (
          <div className="mt-3">
            <h6 className="text-center mb-2">Plataformas</h6>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <button
                className={`btn ${platformFilter === '' ? 'btn-light' : 'btn-outline-light'} filter-btn`}
                onClick={() => setPlatformFilter('')}
              >
                Todas
              </button>
              {allPlatforms.slice(0, 6).map(platform => (
                <button
                  key={platform}
                  className={`btn ${platformFilter === platform ? 'btn-secondary' : 'btn-outline-light'} filter-btn`}
                  onClick={() => setPlatformFilter(platform)}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Biblioteca;