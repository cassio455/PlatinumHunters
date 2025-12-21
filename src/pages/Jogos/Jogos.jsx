import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, X, PlusCircle, CheckCircle } from 'lucide-react';
import { Card, InputGroup, Form, Button, Spinner, Pagination, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsGameInLibrary } from '../../app/slices/librarySlice';
import { addGameToLibrary } from '../../app/thunks/libraryThunks';
import { fetchGames } from '../../app/thunks/gamesThunks';
import { MOCK_USER } from '../User/userMock';
import { useNavigate } from 'react-router-dom';

import './Jogos.css';

const ITEMS_PER_PAGE = 28;

const Jogos = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // -- SELETORES DO REDUX --
  const library = useSelector((state) => state.library.library);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const { items: allGames, loading } = useSelector((state) => state.games);


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addError, setAddError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const scrollRef = useRef(null);


  useEffect(() => {
    if (allGames.length === 0) {
      dispatch(fetchGames());
    }
  }, [dispatch, allGames.length]);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const scrollHorizontally = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const filteredGames = allGames.filter(game => {
    return game.nome?.toLowerCase().includes(searchTerm.toLowerCase());
  });


  const indexOfLastGame = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstGame = indexOfLastGame - ITEMS_PER_PAGE;

  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };


  const featuredGames = useMemo(() => {
    if (allGames.length === 0) return [];
    const shuffled = [...allGames].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  }, [allGames]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const isGameInLibrary = useCallback((gameId) => {
    return library.some(libGame => String(libGame.gameId) === String(gameId));
  }, [library]);

  const handleAddGame = async (game) => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para adicionar jogos à biblioteca!");
      navigate('/user/login');
      return;
    }

    setAddError(null);
    setIsAdding(true);

    // Create game data for enrichment
    const gameData = {
      nome: game.nome,
      backgroundimage: game.backgroundimage,
      playtime: game.playtime || 0,
      genres: game.genres || [],
    };

    const result = await dispatch(addGameToLibrary(String(game._id), 'Lista de Desejos', gameData));

    setIsAdding(false);

    if (result.success) {
      setSelectedGame(null);
      alert(`${game.nome} adicionado à sua biblioteca!`);
    } else {
      setAddError(result.error || 'Erro ao adicionar jogo à biblioteca');
    }
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const modalDescription = selectedGame ?
    `Ano de Lançamento: ${selectedGame.ano_de_lancamento}\nPlataformas: ${selectedGame.plataformas?.join(', ') || 'N/A'}\nGêneros: ${selectedGame.genres?.map(g => g.name || g).join(', ') || 'N/A'}\nRating: ${selectedGame.rating}/5.0`
    : '';

  return (
    <div className="main-page container mt-5 pt-5">
      <div className="section-header mb-4">
        <h1 className="section-title text-center mb-2">Lista de Jogos</h1>
        <div className="section-line"></div>
        <p className="page-subtitle">Explore os jogos do nosso catálogo local</p>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8">
          <InputGroup>
            <InputGroup.Text className="bg-dark border-secondary">
              <Search size={18} className="text-secondary" />
            </InputGroup.Text>
            <Form.Control
              className="bg-dark text-white border-secondary"
              placeholder="Pesquisar jogos no nosso catálogo local..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </div>
      </div>

      {loading && allGames.length === 0 ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3">A carregar...</p>
        </div>
      ) : (
        <>
          {searchTerm.length === 0 && currentPage === 1 && featuredGames.length > 0 && (
            <div className="most-played-section mb-5">
              <h3 className="most-played-title">Conheça novos jogos</h3>
              <div className="scroll-container-wrapper">
                <button className="scroll-arrow left" onClick={() => scrollHorizontally('left')}>&lt;</button>
                <button className="scroll-arrow right" onClick={() => scrollHorizontally('right')}>&gt;</button>
                <div className="most-played-container" ref={scrollRef}>
                  {featuredGames.map((game) => (
                    <div className="most-played-card" key={`mp-${game._id}`} onClick={() => handleGameClick(game)}>
                      <img
                        src={game.backgroundimage || 'https://via.placeholder.com/400x225/1a1a1a/666666?text=Sem+Imagem'}
                        alt={game.nome}
                        className="most-played-img"
                      />
                      <div className="most-played-overlay">
                        <span className="most-played-name">{game.nome}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentGames.length === 0 && searchTerm.length > 0 && (
            <div className="text-center my-5">
              <p>Nenhum jogo encontrado no catálogo local para "{searchTerm}".</p>
            </div>
          )}

          <div className="row mt-4">
            {currentGames.map((game) => (
              <div className="col-6 col-md-4 col-lg-3 mb-4" key={game._id} onClick={() => handleGameClick(game)}>
                <Card className="game-card-jogos bg-dark text-white">
                  <Card.Img src={game.backgroundimage} alt={game.nome} className="game-card-img" />
                  <div className="overlay-jogos">
                    <h5 className="game-title-jogos">{game.nome}</h5>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4 mb-5">
              <Pagination>
                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />

                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <Pagination.Item
                      key={pageNum}
                      active={pageNum === currentPage}
                      onClick={() => paginate(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                })}

                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          )}
        </>
      )}

      {selectedGame && (
        <div className="details-modal-overlay" onClick={() => setSelectedGame(null)}>
          <div className="details-modal-body" onClick={(e) => e.stopPropagation()}>
            <div className="modal-video-container">
              <img
                src={selectedGame.backgroundimage || 'https://via.placeholder.com/800x450/1a1a1a/666666?text=Sem+Imagem'}
                alt={selectedGame.nome}
                className="modal-video-header"
              />
              <div className="modal-video-overlay">
                <h2 className="modal-title">{selectedGame.nome}</h2>
              </div>
              <Button variant="dark" className="modal-close-btn" onClick={() => setSelectedGame(null)}>
                <X size={24} />
              </Button>
            </div>
            <div className="modal-content-area">
              <h3 style={{ fontSize: '1.2rem', color: '#ff6e77', marginBottom: '15px' }}>Detalhes do Catálogo:</h3>
              <p className="modal-description" style={{ whiteSpace: 'pre-wrap' }}>{modalDescription}</p>
              {addError && (
                <Alert variant="danger" dismissible onClose={() => setAddError(null)} className="mt-2">
                  {addError}
                </Alert>
              )}
              <div className="library-status-card mt-3">
                {isGameInLibrary(selectedGame._id) ? (
                  <div className="d-flex align-items-center text-success"><CheckCircle size={20} className="me-2" /><span>Este jogo já está na sua biblioteca.</span></div>
                ) : (
                  <div className="d-flex flex-column align-items-center">
                    <p>Gostaria de adicionar este jogo à sua biblioteca?</p>
                    <Button
                      variant="outline-light"
                      onClick={() => handleAddGame(selectedGame)}
                      disabled={!isAuthenticated || isAdding}
                    >
                      {isAdding ? 'Adicionando...' : (isAuthenticated ? <><PlusCircle size={18} className="me-2" />Adicionar à Biblioteca</> : '🔒 Faça login para adicionar')}
                    </Button>
                    {!isAuthenticated && <small className="text-danger mt-2">Você precisa estar logado.</small>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jogos;