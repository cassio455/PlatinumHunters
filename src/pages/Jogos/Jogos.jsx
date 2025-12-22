import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, X, PlusCircle, CheckCircle, Filter } from 'lucide-react';
import { Card, InputGroup, Form, Button, Spinner, Pagination, Alert, Row, Col, Accordion } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsGameInLibrary } from '../../app/slices/librarySlice';
import { addGameToLibrary } from '../../app/thunks/libraryThunks';
import { fetchGames } from '../../app/thunks/gamesThunks';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

import './Jogos.css';

const API_BASE_URL = 'http://localhost:3000';

const ITEMS_PER_PAGE = 20;

const Jogos = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const library = useSelector((state) => state.library.library);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { items: allGames, loading: reduxLoading } = useSelector((state) => state.games);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addError, setAddError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [genresOptions, setGenresOptions] = useState([]);
  const [platformsOptions, setPlatformsOptions] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [serverGames, setServerGames] = useState([]);
  const [serverTotalPages, setServerTotalPages] = useState(1);
  const [filterLoading, setFilterLoading] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (allGames.length === 0) {
      dispatch(fetchGames());
    }

    const fetchFilterOptions = async () => {
      try {
        const [genresRes, platformsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/genres`),
          axios.get(`${API_BASE_URL}/platforms`)
        ]);
        
        if(genresRes.data && genresRes.data.data) {
            setGenresOptions(genresRes.data.data.items || []);
        }
        if(platformsRes.data && platformsRes.data.data) {
            setPlatformsOptions(platformsRes.data.data.items || []);
        }
      } catch (error) {
        console.error("Erro ao carregar opções de filtros:", error);
      }
    };
    fetchFilterOptions();
  }, [dispatch, allGames.length]);

  useEffect(() => {
    if (!isFilterActive) {
      setCurrentPage(1);
    }
  }, [searchTerm, isFilterActive]);
  const handleApplyFilters = async (pageToLoad = 1) => {
    setFilterLoading(true);
    try {
      const payload = {
        page: pageToLoad,
        limit: ITEMS_PER_PAGE,
        genres: selectedGenres.length > 0 ? selectedGenres : undefined,
        plataformas: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
      };

      const response = await axios.post(`${API_BASE_URL}/games/filters`, payload);
      
      const { items, totalPages } = response.data.data;

      setServerGames(items);
      setServerTotalPages(totalPages);
      setIsFilterActive(true);
      setCurrentPage(pageToLoad);
      
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
      alert("Erro ao buscar jogos com filtros.");
    } finally {
      setFilterLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedPlatforms([]);
    setIsFilterActive(false);
    setCurrentPage(1);
    setSearchTerm('');
  };

  const toggleGenre = (genreName) => {
    setSelectedGenres(prev => 
      prev.includes(genreName) ? prev.filter(g => g !== genreName) : [...prev, genreName]
    );
  };

  const togglePlatform = (platformName) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformName) ? prev.filter(p => p !== platformName) : [...prev, platformName]
    );
  };

  const scrollHorizontally = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const featuredGames = useMemo(() => {
    if (allGames.length === 0) return [];
    const shuffled = [...allGames].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  }, [allGames]);

  let gamesToDisplay = [];
  let displayTotalPages = 1;

  if (isFilterActive) {
    gamesToDisplay = serverGames;
    displayTotalPages = serverTotalPages;
  } else {
    const filteredLocal = allGames.filter(game => {
      return game.nome?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    const indexOfLastGame = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstGame = indexOfLastGame - ITEMS_PER_PAGE;
    
    gamesToDisplay = filteredLocal.slice(indexOfFirstGame, indexOfLastGame);
    displayTotalPages = Math.ceil(filteredLocal.length / ITEMS_PER_PAGE);
  }

  const paginate = (pageNumber) => {
    if (isFilterActive) {
      handleApplyFilters(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
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

    const gameData = {
      nome: game.nome,
      backgroundimage: game.backgroundimage,
      playtime: game.playtime || 0,
      genres: game.genres || [],
    };

    const result = await dispatch(addGameToLibrary(String(game._id || game.id), 'Lista de Desejos', gameData));

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
    `Ano de Lançamento: ${selectedGame.ano_de_lancamento || selectedGame.anoLancamento || 'N/A'}\nPlataformas: ${selectedGame.plataformas?.join(', ') || 'N/A'}\nGêneros: ${selectedGame.genres?.map(g => g.name || g).join(', ') || 'N/A'}\nRating: ${selectedGame.rating}/5.0`
    : '';

  return (
    <div className="main-page container mt-5 pt-5">
      <div className="section-header mb-4">
        <h1 className="section-title text-center mb-2">Lista de Jogos</h1>
        <div className="section-line"></div>
        <p className="page-subtitle">Explore os jogos do nosso catálogo</p>
      </div>

      {!isFilterActive && (
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8">
            <InputGroup>
              <InputGroup.Text className="bg-dark border-secondary">
                <Search size={18} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                className="bg-dark text-white border-secondary"
                placeholder="Pesquisar jogos no catálogo carregado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
      )}

      {!isFilterActive && searchTerm.length === 0 && currentPage === 1 && featuredGames.length > 0 && (
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

      <Row>
        <Col md={3} className="mb-4">
          <div className="bg-dark p-3 rounded border border-secondary text-white sticky-top" style={{ top: '20px', zIndex: 1 }}>
            <h5 className="mb-3 d-flex align-items-center"><Filter size={20} className="me-2"/> Filtros</h5>
            
            <Accordion defaultActiveKey="0" flush className="mb-3 filters-accordion">
              <Accordion.Item eventKey="0" style={{ backgroundColor: 'transparent' }}>
                <Accordion.Header>Gêneros</Accordion.Header>
                <Accordion.Body className="bg-dark text-white" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {genresOptions.map(g => (
                    <Form.Check 
                      key={g._id}
                      type="checkbox"
                      id={`genre-${g._id}`}
                      label={g.name}
                      checked={selectedGenres.includes(g.name)}
                      onChange={() => toggleGenre(g.name)}
                      className="mb-1"
                    />
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <Accordion defaultActiveKey="0" flush className="mb-3 filters-accordion">
              <Accordion.Item eventKey="0" style={{ backgroundColor: 'transparent' }}>
                <Accordion.Header>Plataformas</Accordion.Header>
                <Accordion.Body className="bg-dark text-white" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {platformsOptions.map(p => (
                    <Form.Check 
                      key={p._id}
                      type="checkbox"
                      id={`plat-${p._id}`}
                      label={p.name}
                      checked={selectedPlatforms.includes(p.name)}
                      onChange={() => togglePlatform(p.name)}
                      className="mb-1"
                    />
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <div className="d-grid gap-2">
              <Button variant="primary" onClick={() => handleApplyFilters(1)} disabled={filterLoading}>
                {filterLoading ? <Spinner size="sm" animation="border" /> : 'Aplicar Filtro'}
              </Button>
              {isFilterActive && (
                <Button variant="outline-danger" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              )}
            </div>
          </div>
        </Col>

        <Col md={9}>
          
          {reduxLoading && allGames.length === 0 ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
              <p className="mt-3">Carregando catálogo...</p>
            </div>
          ) : (
            <>
              {gamesToDisplay.length === 0 && (
                <div className="text-center my-5 text-white">
                  <p>Nenhum jogo encontrado com os critérios atuais.</p>
                </div>
              )}

              <div className="row">
                {gamesToDisplay.map((game) => (
                  <div className="col-6 col-md-6 col-lg-4 mb-4" key={game._id || game.id} onClick={() => handleGameClick(game)}>
                    <Card className="game-card-jogos bg-dark text-white">
                      <Card.Img 
                        src={game.backgroundimage || game.backgroundImage} 
                        alt={game.nome} 
                        className="game-card-img" 
                      />
                      <div className="overlay-jogos">
                        <h5 className="game-title-jogos">{game.nome}</h5>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              {displayTotalPages > 1 && (
                <div className="d-flex justify-content-center mt-4 mb-5">
                  <Pagination>
                    <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />

                    {[...Array(Math.min(5, displayTotalPages))].map((_, index) => {
                      let pageNum = index + 1;
                      if (currentPage > 3 && displayTotalPages > 5) {
                        pageNum = currentPage - 2 + index;
                      }
                      if (pageNum > displayTotalPages) return null;

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

                    <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === displayTotalPages} />
                    <Pagination.Last onClick={() => paginate(displayTotalPages)} disabled={currentPage === displayTotalPages} />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>

      {selectedGame && (
        <div className="details-modal-overlay" onClick={() => setSelectedGame(null)}>
          <div className="details-modal-body" onClick={(e) => e.stopPropagation()}>
            <div className="modal-video-container">
              <img
                src={selectedGame.backgroundimage || selectedGame.backgroundImage || 'https://via.placeholder.com/800x450/1a1a1a/666666?text=Sem+Imagem'}
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
              <h3 style={{ fontSize: '1.2rem', color: '#ff6e77', marginBottom: '15px' }}>Detalhes do Jogo:</h3>
              <p className="modal-description" style={{ whiteSpace: 'pre-wrap' }}>{modalDescription}</p>
              {addError && (
                <Alert variant="danger" dismissible onClose={() => setAddError(null)} className="mt-2">
                  {addError}
                </Alert>
              )}
              <div className="library-status-card mt-3">
                {isGameInLibrary(selectedGame._id || selectedGame.id) ? (
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