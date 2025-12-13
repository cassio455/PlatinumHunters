
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card, InputGroup, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserLibrary } from '../../app/thunks/libraryThunks';
import LibraryStatus from '../../components/LibraryStatus';
import './index.css';

const Biblioteca = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();
  const library = useSelector((state) => state.library.library);
  const loading = useSelector((state) => state.library.loading);
  const error = useSelector((state) => state.library.error);

  const { userId: routeUserId } = useParams();

  useEffect(() => {
    // Fetch library without userId - backend uses auth token
    dispatch(fetchUserLibrary());
  }, [dispatch]);

  const filteredGames = library.filter(game => {
    const matchesSearch = game.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
            <Button as={Link} to={routeUserId ? `/biblioteca/user/${routeUserId}/adicionar` : '/biblioteca/user/1/adicionar'} variant="outline-light" className="add-game-btn">
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
                <Card.Img src={game.img} alt={game.name} className="game-card-img-biblioteca" />
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
    </div >
  );
};


export default Biblioteca;