import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import './CriarGuias.css';
import { useDispatch } from 'react-redux';
import { createGuide } from '../../../app/thunks/guidesThunks';
import { apiRequest } from '../../../services/api';

export default function CriarGuias({
  buttonLabel = 'Criar Guia',
  buttonClassName = '',
  buttonVariant = 'primary',
  buttonSize = undefined,
  onGuiaCriada
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [games, setGames] = useState([]);
  const [gameSearch, setGameSearch] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [trophies, setTrophies] = useState([]);
  const [dicas, setDicas] = useState({});
  const [buscandoTrophies, setBuscandoTrophies] = useState(false);
const dispatch = useDispatch();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      roadmap: ''
    }
  });
// Buscar jogos por nome
  useEffect(() => {
    async function fetchGames() {
      if (!gameSearch.trim()) {
        setGames([]);
        return;
      }
      try {
        const data = await apiRequest(`/games?search=${encodeURIComponent(gameSearch)}`, { method: 'GET' });
        setGames(data);
      } catch (err) {
        console.error('Erro ao buscar jogos:', err);
        setGames([]);
      }
    }
    const timeout = setTimeout(fetchGames, 500);
    return () => clearTimeout(timeout);
  }, [gameSearch]);
// Buscar troféus do jogo selecionado
  useEffect(() => {
    async function fetchTrophies() {
      if (!selectedGame) {
        setTrophies([]);
        return;
      }
      setBuscandoTrophies(true);
      setErro('');
      try {
        const data = await apiRequest(`/games/${selectedGame._id}/trophies`, { method: 'GET' });
        setTrophies(data);
        const dicasInit = {};
        data.forEach(trof => {
          dicasInit[trof.id] = '';
        });
        setDicas(dicasInit);
      } catch (err) {
        console.error('Erro ao buscar troféus do jogo:', err);
        setErro('Erro ao buscar troféus do jogo.');
        setTrophies([]);
      } finally {
        setBuscandoTrophies(false);
      }
    }
    fetchTrophies();
  }, [selectedGame]);
const todasDicasPreenchidas = trophies.length > 0 && trophies.every(trof => dicas[trof.id]?.trim());
const onSubmit = async (data) => {
    if (!selectedGame) {
      setErro('Selecione um jogo!');
      return;
    }
    if (!todasDicasPreenchidas) {
      setErro('Preencha uma dica para cada troféu!');
      return;
    }
    setLoading(true);
    setErro('');
    try {
      const trophiesComDicas = trophies.map(trof => ({
        ...trof,
        howTo: dicas[trof.id]
      }));
      await dispatch(createGuide({
        ...data,
        game: selectedGame._id,
        trophies: trophiesComDicas,
        comments: []
      })).unwrap();
      alert(`Guia "${data.title}" criado com sucesso!`);
      reset();
      setOpen(false);
      setGames([]);
      setSelectedGame(null);
      setTrophies([]);
      setDicas({});
      setGameSearch('');
      if (onGuiaCriada) onGuiaCriada();
    } catch (error) {
      setErro(error.message || 'Erro ao criar guia.');
    } finally {
      setLoading(false);
    }
  };
return (
    <div className="criar-guia-page">
      <Button
        className={`criar-guia-btn ${buttonClassName}`}
        variant={buttonVariant}
        size={buttonSize}
        onClick={() => setOpen(true)}
      >
        {buttonLabel}
      </Button>
      {open && (
        <div className="criar-guia-overlay" role="dialog" aria-modal="true">
          <div className="criar-guia-modal">
            <div className="criar-guia-header">
              <h2>Criar Guia de Platina</h2>
              <button className="close-btn" type="button" aria-label="Fechar" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
            <Form className="criar-guia-form" onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label>Título do Guia</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Ex: Guia de Platina — God of War"
                    {...register('title', { required: 'O título é obrigatório' })}
                    isInvalid={!!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title?.message}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Buscar Jogo</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Digite o nome do jogo"
                    value={gameSearch}
                    onChange={e => setGameSearch(e.target.value)}
                  />
                </InputGroup>
                {games.length > 0 && (
                  <Form.Select
                    className="mt-2"
                    value={selectedGame ? selectedGame._id : ''}
                    onChange={e => {
                      const game = games.find(g => g._id === e.target.value);
                      setSelectedGame(game || null);
                    }}
                  >
                    <option value="">Selecione o jogo</option>
                    {games.map(game => (
                      <option key={game._id} value={game._id}>
                        {game.title} ({game.platform})
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Prévia / Roadmap</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Descreva brevemente como completar a platina..."
                  {...register('roadmap', {
                    required: 'Uma prévia do roadmap é obrigatória'
                  })}
                  isInvalid={!!errors.roadmap}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.roadmap?.message}
                </Form.Control.Feedback>
              </Form.Group>
              {buscandoTrophies && (
                <div className="mb-3">
                  <Spinner animation="border" variant="light" /> Buscando troféus do jogo...
                </div>
              )}
              {trophies.length > 0 && (
                <div className="mb-4">
                  <h5>Adicione uma dica para cada troféu:</h5>
                  {trophies.map(trof => (
                    <Form.Group key={trof.id} className="mb-3">
                      <Form.Label>
                        <b>{trof.name}</b> ({trof.type}, {trof.rarity})<br />
                        <span className="text-secondary">{trof.description}</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Dica para conquistar este troféu"
                        value={dicas[trof.id] || ''}
                        onChange={e => setDicas({ ...dicas, [trof.id]: e.target.value })}
                        required
                      />
                    </Form.Group>
                  ))}
                </div>
              )}
              {erro && <Alert variant="danger" className="mb-2">{erro}</Alert>}
              <div className="criar-guia-actions">
                <Button variant="outline-light" className="cancel-btn" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="outline-light"
                  className="submit-btn"
                  disabled={loading || !todasDicasPreenchidas}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'Salvar Guia'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}