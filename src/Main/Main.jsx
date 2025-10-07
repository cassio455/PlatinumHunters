import { useSelector } from "react-redux";
import ReviewCard from "../components/ReviewCard";
import "./Main.css"

function Main() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const games = [
    { id: 1, title: "Hollow Knight: Silksong", image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co3vtl.jpg" },
    { id: 2, title: "Hollow Knight", image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co93cr.jpg" },
    { id: 3, title: "Clair Obscur: Expedition 33", image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co9gam.jpg" },
    { id: 4, title: "Peak", image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coa1i1.jpg" },
    { id: 5, title: "Metal Gear Solid Delta: Snake Eater", image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coac1n.jpg" },
    { id: 6, title: "Donkey Kong Bananza", image: "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/coa082.jpg" },
  ];

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
  const name = useSelector((state) => state.auth.user?.name) || "visitante";
  return (
    <div className="main-page container mt-5 pt-5">
      <h1 className="welcome-text mb-4">
        {isAuthenticated && user
          ? `Bem-vindo ${name}! Seus troféus lhe aguardam...`
          : "Bem-vindo! Seus troféus lhe aguardam..."}
      </h1>

      <div className="trending-header">
        <p className="section-title text-start mb-2">Jogos Populares Recentemente</p>
        <div className="section-line"></div>

        <div className="games-grid mt-4">
          {games.map((game) => (
            <div className="game-card" key={game.id}>
              <img src={game.image} alt={game.title} />
              <div className="overlay">
                <h5 className="game-title">{game.title}</h5>
              </div>
            </div>
          ))}
        </div>

        <div className="reviews-header mt-5">
          <p className="section-title text-start mb-2">Reviews Populares Recentemente</p>
          <div className="section-line"></div>

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