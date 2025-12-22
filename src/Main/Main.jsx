import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import { fetchGames } from "../app/thunks/gamesThunks";
import "./Main.css"

function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: allGames } = useSelector((state) => state.games);

  useEffect(() => {
    if (allGames.length === 0) {
      dispatch(fetchGames());
    }
  }, [dispatch, allGames.length]);

  // Pega 6 jogos aleatórios da API
  const popularGames = useMemo(() => {
    if (allGames.length === 0) return [];
    const shuffled = [...allGames].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, [allGames]);

  const reviews = [
    {
      id: 1,
      reviewer: "Alice",
      game: "Hollow Knight",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_small_2x/co93cr.jpg",
      rating: 5,
      text: "Jogo fantástico com ótima história e gameplay!",
      likes: 30
    },
    {
      id: 2,
      reviewer: "Bob",
      game: "Clair Obscur: Expedition 33",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_small_2x/co9gam.jpg",
      rating: 4,
      text: "Desafiador, mas com gameplay satisfatória.",
      likes: 22
    },
    {
      id: 3,
      reviewer: "Charlie",
      game: "Peak",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_small_2x/coa1i1.jpg",
      rating: 4.5,
      text: "Divertido para jogar com os amigos!",
      likes: 18
    }
  ];

  const username = user?.username || "visitante";

  return (
    <div className="main-page container mt-5 pt-5">
      <h1 className="welcome-text mb-4">
        {isAuthenticated && user
          ? `Bem-vindo ${username}! Seus troféus lhe aguardam...`
          : "Bem-vindo! Seus troféus lhe aguardam..."}
      </h1>

      <div className="trending-header">
        <p className="main-page-title text-start mb-2">Jogos Populares Recentemente</p>
        <div className="main-page-line"></div>

        <div className="games-grid mt-4">
          {popularGames.map((game) => (
            <div
              className="main-page-game-card"
              key={game._id}
              onClick={() => navigate('/jogos')}
              style={{ cursor: 'pointer' }}
            >
              <img src={game.backgroundimage} alt={game.nome} />
              <div className="main-page-overlay">
                <h5 className="game-title">{game.nome}</h5>
              </div>
            </div>
          ))}
        </div>

        <div className="reviews-header mt-5">
          <p className="main-page-title text-start mb-2">Reviews Populares Recentemente</p>
          <div className="main-page-line"></div>

          <div className="row mt-4">
            {reviews.map((rev) => (
              <div className="col-12 col-md-4 mb-4" key={rev.id}>
                <ReviewCard
                  reviewer={rev.reviewer}
                  game={rev.game}
                  image={rev.image}
                  rating={rev.rating}
                  text={rev.text}
                  likes={rev.likes}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;