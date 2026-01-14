import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Spinner, Modal, Form, Alert } from 'react-bootstrap';
import './DetalheGuias.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearGuideDetails } from '../../../app/slices/guidesSlice';
import { fetchGuideDetails } from '../../../app/thunks/guidesThunks';
import { apiRequest } from '../../../services/api';

export default function DetalheGuias() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { guideDetails, loading, error } = useSelector(state => state.guides);
// Estados para edição
  const [showEdit, setShowEdit] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editRoadmap, setEditRoadmap] = useState('');
  const [editTrophies, setEditTrophies] = useState([]);
// Estado para deleção
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
useEffect(() => {
    dispatch(fetchGuideDetails(id));
    return () => dispatch(clearGuideDetails());
  }, [dispatch, id]);
useEffect(() => {
    if (guideDetails) {
      setEditTitle(guideDetails.title);
      setEditRoadmap(guideDetails.roadmap);
      setEditTrophies(guideDetails.trophies.map(trof => ({ ...trof })));
    }
  }, [guideDetails]);
if (loading) {
    return (
      <div className="detalhe-guia-container bg-dark text-light border-light rounded p-4">
        <Spinner animation="border" variant="light" /> Carregando detalhes da guia...
      </div>
    );
  }
if (error || !guideDetails) {
    return (
      <div className="detalhe-nao-encontrado bg-dark text-light p-4 rounded">
        {error || 'Guia não encontrado.'}
      </div>
    );
  }
const guia = guideDetails;
// PATCH - Editar guia
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      await apiRequest(`/guides/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editTitle,
          roadmap: editRoadmap,
          trophies: editTrophies
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      setShowEdit(false);
      dispatch(fetchGuideDetails(id));
    } catch (err) {
      console.error('Erro ao editar guia:', err);
      setEditError('Erro ao editar guia.');
    } finally {
      setEditLoading(false);
    }
  };
// DELETE - Deletar guia
  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await apiRequest(`/guides/${id}`, { method: 'DELETE' });
      setShowDeleteConfirm(false);
      navigate('/guias');
    } catch (err) {
      console.error('Erro ao deletar guia:', err);
      setDeleteError('Erro ao deletar guia.');
    } finally {
      setDeleteLoading(false);
    }
  };
return (
    <div className="detalhe-guia-container bg-dark text-light border-light rounded p-4">
      <h2 className="mb-3">{guia.title}</h2>
      <div className="mb-2"><strong>Jogo:</strong> {guia.game}</div>
      <div className="mb-2"><strong>Descrição:</strong> {guia.roadmap}</div>
      <div className="mb-2"><strong>Autor:</strong> {guia.author}</div>
      <div className="mb-3">
        <span className="me-2">Curtidas:</span>
        <Badge bg="danger">{guia.likes}</Badge>
      </div>
      <div className="mb-3 d-flex gap-2">
        <Button variant="outline-warning" size="sm" onClick={() => setShowEdit(true)}>
          Editar
        </Button>
        <Button variant="outline-danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
          Deletar
        </Button>
      </div>
      <hr />
      <h4 className="mb-2">Troféus</h4>
      <div className="detalhe-trofeus-lista mb-4">
        {guia.trophies.map(trof => (
          <Card key={trof.id} className="trofeu-card mb-3 bg-dark text-light border-light">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title>
                    {trof.name}
                    {trof.type === 'Platina' && <Badge bg="warning" className="ms-2 text-dark">Platina</Badge>}
                    {trof.type === 'Ouro' && <Badge bg="warning" className="ms-2 text-dark">Ouro</Badge>}
                    {trof.type === 'Prata' && <Badge bg="secondary" className="ms-2">Prata</Badge>}
                  </Card.Title>
                  <Card.Subtitle className="mb-1">{trof.rarity}</Card.Subtitle>
                  <Card.Text className="trofeu-descricao">{trof.description}</Card.Text>
                  <div className="trofeu-como-obter text-secondary fst-italic">
                    Como obter: {trof.howTo}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
      <div className="mt-3">
        <Button variant="outline-light" size="sm" onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    {/* Modal de edição */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Guia</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Roadmap</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editRoadmap}
                onChange={e => setEditRoadmap(e.target.value)}
                required
              />
            </Form.Group>
            <hr />
            <h5>Troféus</h5>
            {editTrophies.map((trof, idx) => (
              <Form.Group key={trof.id} className="mb-3">
                <Form.Label>
                  <b>{trof.name}</b> ({trof.type}, {trof.rarity})<br />
                  <span className="text-secondary">{trof.description}</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={trof.howTo}
                  onChange={e => {
                    const newTrophies = [...editTrophies];
                    newTrophies[idx].howTo = e.target.value;
                    setEditTrophies(newTrophies);
                  }}
                  required
                />
              </Form.Group>
            ))}
            {editError && <Alert variant="danger">{editError}</Alert>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={editLoading}>
              {editLoading ? <Spinner animation="border" size="sm" /> : 'Salvar Alterações'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    {/* Modal de confirmação de deleção */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Deleção</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja deletar este guia? Esta ação não pode ser desfeita.
          {deleteError && <Alert variant="danger" className="mt-2">{deleteError}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? <Spinner animation="border" size="sm" /> : 'Deletar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}