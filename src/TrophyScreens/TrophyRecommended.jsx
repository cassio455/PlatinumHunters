import { Link } from "react-router-dom";
import "./TrophyRecommended.css";

function TrophyRecommended() {
  const dispatch = useDispatch();
  
  // Busca os dados do banco para tentar usar as imagens reais atualizadas
  const availableGames = useSelector((state) => state.trophies.availableGames || []);

  useEffect(() => {
    if (availableGames.length === 0) {
      dispatch(fetchAvailableGamesThunk());
    }
  }, [dispatch, availableGames.length]);

  // Mantive sua estrutura exata. 
  // APENAS atualizei os 'id' para baterem com os nomes gerados no seu Banco de Dados (slugs),
  // senão ao clicar o link daria erro 404.
  const categories = [
    {
      title: "SoulsLike",
      games: [
        { id: "elden-ring", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg" },
        { id: "dark-souls-prepare-to-die-edition", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1x78.jpg" }, // Atualizado ID
        { id: "dark-souls-iii", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1vcf.jpg" }, // Atualizado ID
        { id: "sekiro-shadows-die-twice", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2a23.jpg" }, // Atualizado ID
        { id: "bloodborne", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rba.jpg" },
      ]
    },
    {
      title: "God Of War",
      games: [
        { id: "god-of-war-2018", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpg" }
      ]
    },
    {
      title: "Resident Evil",
      games: [
        { id: "resident-evil-7-biohazard", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2vvb.jpg" },
        { id: "resident-evil-4-2005", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2wki.jpg" }, // Atualizado ID (versão clássica do seed)
        { id: "resident-evil-5", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2vzi.jpg" },
        { id: "resident-evil-2-1998", image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co3pyq.jpg" }, // Atualizado ID (versão clássica do seed)
      ]
    },
  ];

  return (
    <div className="container mt-5 pt-5">
      <div className="trophy-rec-header mb-4 d-flex justify-content-center align-items-center">
        <h1 className="section-title mb-2">Platinas Recomendadas</h1>
        <Link to="/trophy" className="trophy-rec-swap-button ms-3">
          <i className="bi bi-arrow-repeat text-danger"></i>
        </Link>
      </div>

      {categories.map((cat) => (
        <div key={cat.title} className="mb-5">
          <h3 className="recommended-subtitle mb-3">{cat.title}</h3>
          <div className="trophy-recommended-line mb-3"></div>
          <div className="row">
            {cat.games.map((gameItem) => {
              // Lógica nova APENAS AQUI: Tenta achar a imagem no banco. Se não achar, usa a fixa do seu código original.
              const dbGame = availableGames.find(g => g.id === gameItem.id);
              const finalImage = dbGame ? (dbGame.backgroundimage || dbGame.image) : gameItem.image;
              const finalName = dbGame ? (dbGame.nome || dbGame.name) : gameItem.id;

              return (
                <div key={gameItem.id} className="col-6 col-md-4 col-lg-2 mb-4">
                  <Link to={`/trophy/${gameItem.id}`} className="trophy-rec-card">
                    <img 
                      src={finalImage} 
                      alt={finalName} 
                      className="trophy-rec-img" 
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrophyRecommended;