export const sampleGames = [
  {
    id: 1,
    img: 'https://upload.wikimedia.org/wikipedia/en/5/5d/Hollow_Knight_Silksong_first_cover_art.jpg',
    name: 'Hollow Knight: Silksong',
    progresso: '72%',
    status: 'jogando'
  },
  {
    id: 2,
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0PkpfjmguEnQbkqY2SCNqjoC_3hEJUmrTMQ&s',
    name: 'Hollow Knight',
    progresso: '100%',
    status: 'platinado'
  },
  {
    id: 3,
    img: 'https://image.api.playstation.com/vulcan/ap/rnd/202406/0513/d35b305652ee922a72b4020bd5d6ef36675cf526dd4945d1.png',
    name: 'Metal Gear Solid Delta: Snake Eater',
    progresso: '0%',
    status: 'não iniciado'
  },
  {
    id: 4,
    img: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Clair_Obscur%2C_Expedition_33_Cover_1.webp/250px-Clair_Obscur%2C_Expedition_33_Cover_1.webp.png',
    name: 'Clair Obscur: Expedition 33',
  },
  {
    id: 5,
    img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3527290/c6791f0f1b7b29f6304e283ac7a2cabc27c7eb0d/capsule_616x353.jpg?t=1757111056',
    name: 'Peak',
  },
];

export const guidesData = [
  {
    id: 1,
    title: "Platina Completa - Celeste",
    description: "Guia completo para conseguir a platina em Celeste, incluindo dicas para as fases mais difíceis.",
    author: "GameMaster",
    difficulty: "Difícil",
    estimatedTime: "25-30 horas",
    rating: 4.8,
    views: 1250,
    category: "Platina",
    tags: ["Indie", "Plataforma", "Desafio"],
    image: "https://i.imgur.com/sample1.jpg",
    type: "guide"
  },
  {
    id: 2,
    title: "Todos os Coletáveis - Hollow Knight",
    description: "Localização de todos os itens coletáveis e segredos escondidos no reino de Hallownest.",
    author: "TrophyHunter",
    difficulty: "Médio",
    estimatedTime: "15-20 horas",
    rating: 4.9,
    views: 2340,
    category: "Coletáveis",
    tags: ["Metroidvania", "Exploração", "RPG"],
    image: "https://i.imgur.com/sample2.jpg",
    type: "guide"
  },
  {
    id: 3,
    title: "Speedrun Tutorial - Cuphead",
    description: "Técnicas avançadas e rotas otimizadas para speedrun em Cuphead.",
    author: "SpeedRunner",
    difficulty: "Muito Difícil",
    estimatedTime: "5-10 horas",
    rating: 4.6,
    views: 890,
    category: "Speedrun",
    tags: ["Arcade", "Boss Fight", "Técnico"],
    image: "https://i.imgur.com/sample3.jpg",
    type: "video"
  },
  {
    id: 4,
    title: "Builds Completas - Elden Ring",
    description: "As melhores builds para diferentes estilos de jogo em Elden Ring.",
    author: "EldenExpert",
    difficulty: "Médio",
    estimatedTime: "50+ horas",
    rating: 4.7,
    views: 3450,
    category: "Builds",
    tags: ["RPG", "Souls-like", "Estratégia"],
    image: "https://i.imgur.com/sample4.jpg",
    type: "guide"
  },
  {
    id: 5,
    title: "Troféus Perdíveis - The Witcher 3",
    description: "Lista completa de troféus que podem ser perdidos permanentemente.",
    author: "WitcherFan",
    difficulty: "Fácil",
    estimatedTime: "2-3 horas",
    rating: 4.9,
    views: 1850,
    category: "Troféus",
    tags: ["RPG", "Open World", "Checklist"],
    image: "https://i.imgur.com/sample5.jpg",
    type: "guide"
  }
];

export const rankingData = [
  {
    id: 1,
    position: 1,
    username: "kaori",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kaori",
    platinums: 153,
    totalTrophies: 2847,
    rank: "S+",
    points: 15300,
    monthlyGain: "+12"
  },
  {
    id: 2,
    position: 2,
    username: "nineko",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nineko",
    platinums: 120,
    totalTrophies: 2156,
    rank: "S",
    points: 12000,
    monthlyGain: "+8"
  },
  {
    id: 3,
    position: 3,
    username: "player_three",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3",
    platinums: 98,
    totalTrophies: 1876,
    rank: "A+",
    points: 9800,
    monthlyGain: "+15"
  },
  {
    id: 4,
    position: 4,
    username: "você",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
    platinums: 47,
    totalTrophies: 1247,
    rank: "B+",
    points: 4700,
    monthlyGain: "+5",
    isCurrentUser: true
  },
  {
    id: 5,
    position: 5,
    username: "gamer_legend",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=legend",
    platinums: 43,
    totalTrophies: 1156,
    rank: "B",
    points: 4300,
    monthlyGain: "+3"
  }
];

export const challenges = [
  {
    id: 1,
    title: "Indie Master",
    description: "Platine 1 jogo indie em 30 dias",
    participants: 234,
    timeLeft: "15 dias",
    reward: "Título especial + 500 pts",
    difficulty: "Médio"
  },
  {
    id: 2,
    title: "Speed Runner",
    description: "Complete 3 jogos em uma semana",
    participants: 89,
    timeLeft: "3 dias",
    reward: "Badge exclusivo + 300 pts",
    difficulty: "Difícil"
  },
  {
    id: 3,
    title: "Colecionador",
    description: "Colete 100 troféus este mês",
    participants: 456,
    timeLeft: "20 dias",
    reward: "Avatar especial + 200 pts",
    difficulty: "Fácil"
  }
];

export const trophyData = [
  {
    id: 1,
    name: "Campeão de Celeste",
    description: "Jogo concluído completamente",
    type: "platinum",
    game: "Celeste",
    rarity: "Ultra Raro",
    dateEarned: "2024-01-15"
  },
  {
    id: 2,
    name: "Senhor de Hollow Knight",
    description: "Todos os troféus coletados",
    type: "platinum",
    game: "Hollow Knight",
    rarity: "Ultra Raro",
    dateEarned: "2024-02-10"
  },
  {
    id: 3,
    name: "Explorador Veterano",
    description: "Explorou todas as áreas",
    type: "gold",
    game: "Elden Ring",
    rarity: "Raro",
    dateEarned: "2024-03-05"
  }
];
// ainda não usado.
export const TROPHY_TYPES = {
  BRONZE: 'Bronze',
  SILVER: 'Prata', 
  GOLD: 'Ouro',
  PLATINUM: 'Platina'
};

export const GAME_STATUS = {
  COMPLETED: 'Completo',
  IN_PROGRESS: 'Em Progresso',
  NOT_STARTED: 'Não Iniciado'
};