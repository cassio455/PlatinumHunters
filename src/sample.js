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

export const sampleUsers = [
  { 
    id: 1, 
    name: "Alice", 
    avatar: "https://i.pravatar.cc/100?img=20", 
    equippedTitle: "🌸 Explorador de Sakura 🌸",
    platinums: 45,
    totalTrophies: 1200,
    weeklyPoints: 150,
    monthlyPoints: 500,
    allTimePoints: 1500
  },
  { 
    id: 2, 
    name: "Maria", 
    avatar: "https://i.pravatar.cc/100?img=16",
    platinums: 30,
    totalTrophies: 980,
    weeklyPoints: 80,
    monthlyPoints: 450,
    allTimePoints: 1400
  },
  { 
    id: 3, 
    name: "Charlie", 
    avatar: "https://i.pravatar.cc/100?img=3",
    equippedTitle: "🧩 Complecionista de Puzzles 🧩",
    platinums: 22,
    totalTrophies: 750,
    weeklyPoints: 200,
    monthlyPoints: 600,
    allTimePoints: 1300
  },
  { 
    id: 4, 
    name: "David", 
    avatar: "https://i.pravatar.cc/100?img=4",
    platinums: 15,
    totalTrophies: 600,
    weeklyPoints: 50,
    monthlyPoints: 300,
    allTimePoints: 1200
  },
  { 
    id: 5, 
    name: "Eve", 
    avatar: "https://i.pravatar.cc/100?img=5",
    platinums: 10,
    totalTrophies: 450,
    weeklyPoints: 120,
    monthlyPoints: 400,
    allTimePoints: 1100
  },
  { 
    id: 6, 
    name: "Hank", 
    avatar: "https://i.pravatar.cc/100?img=8",
    equippedTitle: "⚔️ Caçador de Elite ⚔️",
    platinums: 80,
    totalTrophies: 2100,
    weeklyPoints: 300,
    monthlyPoints: 1100,
    allTimePoints: 2500
  },
  { 
    id: 7, 
    name: "Ivy", 
    avatar: "https://i.pravatar.cc/100?img=9",
    platinums: 75,
    totalTrophies: 1900,
    weeklyPoints: 180,
    monthlyPoints: 950,
    allTimePoints: 2400
  },
  { 
    id: 8, 
    name: "Jack", 
    avatar: "https://i.pravatar.cc/100?img=17",
    platinums: 68,
    totalTrophies: 1750,
    weeklyPoints: 250,
    monthlyPoints: 1000,
    allTimePoints: 2300
  },
  { 
    id: 9, 
    name: "Kate", 
    avatar: "https://i.pravatar.cc/100?img=19",
    equippedTitle: "📝 Mestre das Reviews 📝",
    platinums: 60,
    totalTrophies: 1500,
    weeklyPoints: 100,
    monthlyPoints: 700,
    allTimePoints: 2200
  },
  { 
    id: 10, 
    name: "Leo", 
    avatar: "https://i.pravatar.cc/100?img=12",
    platinums: 55,
    totalTrophies: 1400,
    weeklyPoints: 170,
    monthlyPoints: 850,
    allTimePoints: 2100
  },
  { 
    id: 11, 
    name: "Mia", 
    avatar: "https://i.pravatar.cc/100?img=21",
    equippedTitle: "🌸 Explorador de Sakura 🌸",
    platinums: 150,
    totalTrophies: 4500,
    weeklyPoints: 400,
    monthlyPoints: 1500,
    allTimePoints: 3500
  },
  { 
    id: 12, 
    name: "Nina", 
    avatar: "https://i.pravatar.cc/100?img=22",
    platinums: 140,
    totalTrophies: 4200,
    weeklyPoints: 350,
    monthlyPoints: 1400,
    allTimePoints: 3400
  },
  { 
    id: 13, 
    name: "Oscar", 
    avatar: "https://i.pravatar.cc/100?img=15",
    equippedTitle: "⚔️ Caçador de Elite ⚔️",
    platinums: 130,
    totalTrophies: 3900,
    weeklyPoints: 280,
    monthlyPoints: 1300,
    allTimePoints: 3300
  },
];

export const weeklyRanking = [...sampleUsers]
  .sort((a, b) => b.weeklyPoints - a.weeklyPoints)

export const monthlyRanking = [...sampleUsers]
  .sort((a, b) => b.monthlyPoints - a.monthlyPoints)

export const allTimeRanking = [...sampleUsers]
  .sort((a, b) => b.allTimePoints - a.allTimePoints)

export const monthlyChallenges = [
    { day: 1, title: "Jogue 30 minutos em qualquer jogo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1], sampleUsers[2], sampleUsers[3], sampleUsers[4]] },
    { day: 2, title: "Termine 1 review de um jogo", points: 75, completedBy: [sampleUsers[2], sampleUsers[3], sampleUsers[5], sampleUsers[6], sampleUsers[7]] },
    { day: 3, title: "Conseguir 1 troféu num jogo indie", points: 100, completedBy: [sampleUsers[0], sampleUsers[4], sampleUsers[8], sampleUsers[9], sampleUsers[10]] },
    { day: 4, title: "Completar 1 nível num jogo de plataforma", points: 50, completedBy: [sampleUsers[1], sampleUsers[5], sampleUsers[6], sampleUsers[11], sampleUsers[12]] },
    { day: 5, title: "Colete 100 pontos num jogo", points: 60, completedBy: [sampleUsers[6], sampleUsers[7], sampleUsers[8], sampleUsers[9], sampleUsers[10]] },
    { day: 6, title: "Ganhe uma partida num jogo competitivo", points: 80, completedBy: [sampleUsers[0], sampleUsers[1], sampleUsers[3], sampleUsers[4], sampleUsers[11]] },
    { day: 7, title: "Desbloqueie um troféu escondido", points: 150, completedBy: [sampleUsers[2], sampleUsers[3], sampleUsers[5], sampleUsers[8], sampleUsers[12]] },
    { day: 8, title: "Jogue 30 minutos em qualquer jogo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1], sampleUsers[4], sampleUsers[7], sampleUsers[9]] },
    { day: 9, title: "Termine 1 review de um jogo", points: 75, completedBy: [sampleUsers[2], sampleUsers[3], sampleUsers[6], sampleUsers[10], sampleUsers[11]] },
    { day: 10, title: "Conseguir 1 troféu num jogo indie", points: 100, completedBy: [sampleUsers[0], sampleUsers[4], sampleUsers[5], sampleUsers[8], sampleUsers[12]] },
    { day: 11, title: "Completar 1 nível num jogo de plataforma", points: 50, completedBy: [sampleUsers[1], sampleUsers[5], sampleUsers[7], sampleUsers[9], sampleUsers[10]] },
    { day: 12, title: "Colete 100 pontos num jogo", points: 60, completedBy: [sampleUsers[6], sampleUsers[8], sampleUsers[9], sampleUsers[11], sampleUsers[12]] },
    { day: 13, title: "Ganhe uma partida num jogo competitivo", points: 80, completedBy: [sampleUsers[0], sampleUsers[1], sampleUsers[2], sampleUsers[3], sampleUsers[4]] },
    { day: 14, title: "Desbloqueie um troféu escondido", points: 150, completedBy: [sampleUsers[2], sampleUsers[3], sampleUsers[6], sampleUsers[7], sampleUsers[10]] },
    { day: 15, title: "Jogue 30 minutos em qualquer jogo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1], sampleUsers[5], sampleUsers[8], sampleUsers[11]] },
    { day: 16, title: "Termine 1 review de um jogo", points: 75, completedBy: [sampleUsers[2], sampleUsers[3], sampleUsers[4], sampleUsers[9], sampleUsers[12]] },
    { day: 17, title: "Conseguir 1 troféu num jogo indie", points: 100, completedBy: [sampleUsers[0], sampleUsers[4], sampleUsers[6], sampleUsers[7], sampleUsers[10]] },
    { day: 18, title: "Completar 1 nível num jogo de plataforma", points: 50, completedBy: [sampleUsers[1], sampleUsers[5], sampleUsers[8], sampleUsers[9], sampleUsers[11]] },
    { day: 19, title: "Colete 100 pontos num jogo", points: 60, completedBy: [sampleUsers[6], sampleUsers[7], sampleUsers[10], sampleUsers[11], sampleUsers[12]] },
    { day: 20, title: "Ganhe uma partida num jogo competitivo", points: 80, completedBy: [sampleUsers[0], sampleUsers[1], sampleUsers[2], sampleUsers[5], sampleUsers[8]] },
    { day: 21, title: "Desbloqueie um troféu escondido", points: 150, completedBy: [sampleUsers[2], sampleUsers[3], sampleUsers[4], sampleUsers[9], sampleUsers[10]] },
    { day: 22, title: "Jogue 30 minutos em qualquer jogo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1], sampleUsers[6], sampleUsers[7], sampleUsers[11]] },
    { day: 23, title: "Termine 1 review de um jogo", points: 75, completedBy: [sampleUsers[2], sampleUsers[3], sampleUsers[5], sampleUsers[8], sampleUsers[12]] },
    { day: 24, title: "Conseguir 1 troféu num jogo indie", points: 100, completedBy: [sampleUsers[0], sampleUsers[4], sampleUsers[7], sampleUsers[9], sampleUsers[10]] },
    { day: 25, title: "Completar 1 nível num jogo de plataforma", points: 50, completedBy: [sampleUsers[1], sampleUsers[5], sampleUsers[6], sampleUsers[8], sampleUsers[11]] },
    { day: 26, title: "Colete 100 pontos num jogo", points: 60, completedBy: [sampleUsers[6], sampleUsers[9], sampleUsers[10], sampleUsers[11], sampleUsers[12]] },
    { day: 27, title: "Ganhe uma partida num jogo competitivo", points: 80, completedBy: [sampleUsers[0], sampleUsers[1], sampleUsers[3], sampleUsers[7], sampleUsers[8]] },
    { day: 28, title: "Desbloqueie um troféu escondido", points: 150, completedBy: [sampleUsers[2], sampleUsers[3], sampleUsers[4], sampleUsers[5], sampleUsers[9]] },
    { day: 29, title: "Jogue 30 minutos em qualquer jogo", points: 50, completedBy: [sampleUsers[0], sampleUsers[1], sampleUsers[6], sampleUsers[10], sampleUsers[12]] },
    { day: 30, title: "Termine 1 review de um jogo", points: 75, completedBy: [sampleUsers[2], sampleUsers[3], sampleUsers[7], sampleUsers[8], sampleUsers[11]] },
    { day: 31, title: "Conseguir 1 troféu num jogo indie", points: 100, completedBy: [sampleUsers[0], sampleUsers[4], sampleUsers[5], sampleUsers[9], sampleUsers[10]] },
];