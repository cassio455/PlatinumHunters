import React, { useState, useEffect, useCallback } from 'react'; // Importar o useCallback
import { Search, X, PlusCircle, CheckCircle, Play } from 'lucide-react';
import { Card, InputGroup, Form, Button, Spinner } from 'react-bootstrap';
import './Jogos.css';

import { sampleGames } from '../../sample';

// Função debounce para evitar múltiplos pedidos à API
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

const Jogos = () => {
  const [gamesList, setGamesList] = useState([]);
  const [mostPlayedGames, setMostPlayedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameDetails, setGameDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Função para buscar a lista inicial de jogos populares
  const fetchPopularGames = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_RAWG_API_KEY;
      const currentYear = new Date().getFullYear();
      const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating&dates=${currentYear}-01-01,${currentYear}-12-31&page_size=40`);
      const data = await response.json();

      const formattedGames = data.results.map(game => ({
        id: game.id,
        name: game.name,
        image: game.background_image,
        gameplayVideo: game.clip?.clip,
      }));
      
      setGamesList(formattedGames);
      setMostPlayedGames(formattedGames.slice(0, 5));
    } catch (error) {
      console.error("Erro ao buscar jogos populares:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Efeito inicial para carregar os jogos populares
  useEffect(() => {
    fetchPopularGames();
  }, []);

  // Função para pesquisar jogos na API
  const searchGames = async (query) => {
    if (query.trim() === '') {
      fetchPopularGames(); // Se a pesquisa estiver vazia, volta a carregar os jogos populares
      return;
    }
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_RAWG_API_KEY;
      const response = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&page_size=40`);
      const data = await response.json();
      const formattedGames = data.results.map(game => ({
        id: game.id,
        name: game.name,
        image: game.background_image,
        gameplayVideo: game.clip?.clip,
      }));
      setGamesList(formattedGames);
    } catch (error) {
      console.error("Erro ao pesquisar jogos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Criamos uma versão "debounced" da nossa função de pesquisa
  const debouncedSearch = useCallback(debounce(searchGames, 500), []);

  // Handler para quando o texto na barra de pesquisa muda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };
  
  // O resto das funções continua igual...
  const fetchGameDetails = async (gameId) => {
    setDetailsLoading(true);
    try {
      const apiKey = import.meta.env.VITE_RAWG_API_KEY;
      const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`);
      const data = await response.json();
      setGameDetails({ description: data.description_raw });
    } catch (error) {
      console.error("Erro ao buscar detalhes do jogo:", error);
      setGameDetails({ description: "Não foi possível carregar a descrição." });
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setGameDetails(null);
    fetchGameDetails(game.id);
  };

  const isGameInLibrary = (gameId) => {
    return sampleGames.some(libGame => String(libGame.id) === String(gameId));
  };

  const handleAddGame = (game) => {
    console.log(`Adicionando ${game.name} à biblioteca!`);
    setSelectedGame(null);
  };

  return (
    <div className="main-page container mt-5 pt-5">
      <div className="section-header mb-4">
        <h1 className="section-title text-center mb-2">Lista de Jogos</h1>
        <div className="section-line"></div>
        <p className="page-subtitle">Explore os jogos mais populares e bem avaliados do ano</p>
      </div>

      <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8">
            <InputGroup>
              <InputGroup.Text className="bg-dark border-secondary">
                <Search size={18} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                className="bg-dark text-white border-secondary"
                placeholder="Pesquisar em mais de 500.000 jogos..."
                value={searchTerm}
                onChange={handleSearchChange} // Usamos o novo handler
              />
            </InputGroup>
          </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3">A carregar...</p>
        </div>
      ) : (
        <>
          {searchTerm.length === 0 && (
            <div className="most-played-section mb-5">
              <h3 className="most-played-title">Mais Populares do Ano</h3>
              <div className="most-played-container">
                {mostPlayedGames.map((game) => (
                  <div className="most-played-card" key={`mp-${game.id}`} onClick={() => handleGameClick(game)}>
                    <img src={game.image} alt={game.name} className="most-played-img" />
                    <div className="most-played-overlay">
                      <span className="most-played-name">{game.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="row mt-4">
            {gamesList.map((game) => ( // Alterado para gamesList em vez de filteredGames
              <div className="col-6 col-md-4 col-lg-3 mb-4" key={game.id} onClick={() => handleGameClick(game)}>
                <Card className="game-card-jogos bg-dark text-white">
                  <Card.Img src={game.image} alt={game.name} className="game-card-img" />
                  <div className="overlay-jogos">
                    <h5 className="game-title-jogos">{game.name}</h5>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedGame && (
         // O seu painel de detalhes continua aqui, sem alterações...
         <div className="details-modal-overlay" onClick={() => setSelectedGame(null)}>
           <div className="details-modal-body" onClick={(e) => e.stopPropagation()}>
             <div className="modal-video-container">
               {selectedGame.gameplayVideo ? (
                 <video key={selectedGame.id} src={selectedGame.gameplayVideo} autoPlay loop muted className="modal-video-header" />
               ) : (
                 <img src={selectedGame.image} alt={selectedGame.name} className="modal-video-header" />
               )}
               <div className="modal-video-overlay">
                 <h2 className="modal-title">{selectedGame.name}</h2>
               </div>
               <Button variant="dark" className="modal-close-btn" onClick={() => setSelectedGame(null)}>
                 <X size={24} />
               </Button>
             </div>
             <div className="modal-content-area">
               {detailsLoading ? (
                 <div className="text-center my-3"><Spinner animation="border" variant="light" size="sm" /></div>
               ) : (
                 <p className="modal-description">{gameDetails?.description}</p>
               )}
               <div className="library-status-card mt-3">
                 {isGameInLibrary(selectedGame.id) ? (
                   <div className="d-flex align-items-center text-success"><CheckCircle size={20} className="me-2" /><span>Este jogo já está na sua biblioteca.</span></div>
                 ) : (
                   <div className="d-flex flex-column align-items-center">
                     <p>Gostaria de adicionar este jogo à sua biblioteca?</p>
                     <Button variant="outline-light" onClick={() => handleAddGame(selectedGame)}><PlusCircle size={18} className="me-2" />Adicionar à Biblioteca</Button>
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