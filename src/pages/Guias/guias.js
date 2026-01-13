export const guias = [
  {
    id: 1,
    title: 'Platine GOW como um Speedrunner!',
    game: 'God of War',
    roadmap: 'Conclua todas as missões principais, derrote as Valquírias e explore todas as áreas para 100%. Dica: priorize as missões secundárias que concedem equipamentos lendários.',
    likes: 132,
    comentarios: [
      {
        id: 1,
        autor: "Carlos",
        texto: "Ótimo guia, consegui a platina!",
        likes: 2,
        timestamp: "há 5 minutos",
        replies: [
          {
            id: 11,
            autor: "Marcos",
            texto: "Também curti, as dicas de chefes são top!",
            likes: 1,
            timestamp: "há 3 minutos",
            replies: []
          }
        ]
      }
    ],
    trofeus: [
      {
        id: 101,
        nome: 'Platina',
        tipo: 'Platina',
        descricao: 'Conquiste todos os troféus do jogo',
        raridade: 'Raríssimo',
        comoObter: 'Marque todos os outros troféus como conquistados para desbloquear a platina.'
      },
      {
        id: 102,
        nome: 'Valquíria Suprema',
        tipo: 'Ouro',
        descricao: 'Derrote todas as Valquírias',
        raridade: 'Raro',
        comoObter: 'Encontre e derrote todas as Valquírias espalhadas pelo mapa para ganhar esse troféu.'
      },
      {
        id: 103,
        nome: 'Explorador de Midgard',
        tipo: 'Prata',
        descricao: 'Explore todas as áreas secretas',
        raridade: 'Comum',
        comoObter: 'Visite todas as regiões e descubra as áreas escondidas de Midgard.'
      }
    ]
  },
  {
    id: 2,
    title: 'Platina em 20h - Horizon Zero Dawn',
    game: 'Horizon Zero Dawn',
    roadmap: 'Complete todas as missões secundárias e colecione todos os artefatos. Dica: use o arco de precisão para derrotar máquinas grandes.',
    likes: 87,
    comentarios: [],
    trofeus: [
      {
        id: 201,
        nome: 'Platina',
        tipo: 'Platina',
        descricao: 'Complete todos os troféus do jogo',
        raridade: 'Raríssimo',
        comoObter: 'Complete todos os troféus listados para desbloquear a platina.'
      },
      {
        id: 202,
        nome: 'Caçador de Máquinas',
        tipo: 'Ouro',
        descricao: 'Derrote todas as máquinas grandes',
        raridade: 'Raro',
        comoObter: 'Enfrente e derrote todas as máquinas grandes em missões principais e secundárias.'
      },
      {
        id: 203,
        nome: 'Colecionador de Artefatos',
        tipo: 'Prata',
        descricao: 'Encontre todos os artefatos ocultos',
        raridade: 'Comum',
        comoObter: 'Explore o mundo e colete todos os artefatos escondidos.'
      }
    ]
  },
  {
    id: 3,
    title: 'Elden Ring TOTAL E ABSOLUTO',
    game: 'Elden Ring',
    roadmap: 'Explore todos os mapas, derrote chefes secretos e conclua todas as linhas de quest dos NPCs para garantir todos os troféus.',
    likes: 54,
    comentarios: [
      {
        id: 2,
        autor: "Ana",
        texto: "Faltou falar das armas lendárias!",
        likes: 0,
        timestamp: "há 1 hora",
        replies: []
      }
    ],
    trofeus: [
      {
        id: 301,
        nome: 'Platina',
        tipo: 'Platina',
        descricao: 'Consiga todos os troféus do jogo',
        raridade: 'Raríssimo',
        comoObter: 'Conquiste todos os outros troféus e a platina será liberada automaticamente.'
      },
      {
        id: 302,
        nome: 'Senhor dos Chefes',
        tipo: 'Ouro',
        descricao: 'Derrote todos os chefes secretos',
        raridade: 'Raro',
        comoObter: 'Localize e derrote todos os chefes secretos espalhados pelo mapa.'
      },
      {
        id: 303,
        nome: 'Mestre das Quests',
        tipo: 'Prata',
        descricao: 'Conclua todas as quests dos NPCs',
        raridade: 'Comum',
        comoObter: 'Interaja com todos os NPCs e complete todas as linhas de quest disponíveis.'
      }
    ]
  }
]
