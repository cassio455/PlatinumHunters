# Platinum Hunters

Projeto acadêmico de exemplo construído com Vite + React e utilizando Redux para gerenciamento de estado.

Este repositório serve como um pequeno projeto demonstrativo para fins de estudo e avaliação: contém páginas de usuário, biblioteca de jogos, ranking e troféus, além de um mock de API usando `json-server`.

## Tecnologias

- Vite (ferramenta de build / dev server)
- React
- Redux (Redux Toolkit + react-redux)
- React Router
- React Bootstrap (componentes UI)
- json-server (mock de API)

## Scripts úteis

Os scripts disponíveis no `package.json` são:

- `npm run dev` — inicia o servidor de desenvolvimento do Vite.
- `npm run build` — cria o build de produção com Vite.
- `npm run preview` — pré-visualiza o build de produção localmente.
- `npm run server` — inicia o `json-server` (mock API) escutando em `http://localhost:3001`.
- `npm run dev:all` — roda o `json-server` e o servidor do Vite em paralelo (útil para desenvolvimento).
- `npm run lint` — executa o ESLint no projeto.

Exemplo para desenvolver com a API mock e Vite simultaneamente:

```bash
npm install
npm run dev:all
```

Abra `http://localhost:5173` (porta padrão do Vite) para ver a aplicação.

## Estrutura principal

- `src/` — código fonte React
	- `app/` — store, slices e thunks
	- `components/` — componentes reutilizáveis (ex.: `LibraryStatus`)
	- `pages/` — páginas da aplicação (Perfil, Biblioteca, Jogos, Ranking, Troféus)
- `public/` — ativos estáticos
- `db.json` — base de dados fake usada pelo `json-server`

## Observações

- Projeto criado para fins acadêmicos e não destinado a produção.
