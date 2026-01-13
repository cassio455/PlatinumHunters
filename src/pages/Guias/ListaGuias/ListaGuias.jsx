import React, { useEffect } from 'react';
import { Card, Button, Row, Col, Container, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AvaliarGuias from '../AvaliarGuias/AvaliarGuias';
import CriarGuias from '../CriarGuias/CriarGuias';
import './ListaGuias.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGuides } from '../../../app/thunks/guidesThunks';

export default function ListaGuias() {
  const [filtro, setFiltro] = React.useState('populares');
  const [busca, setBusca] = React.useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { guides, loading, error } = useSelector(state => state.guides);
useEffect(() => {
    dispatch(fetchGuides());
  }, [dispatch]);
const guiasFiltrados = guides
    .filter(guia =>
      guia.title.toLowerCase().includes(busca.toLowerCase()) ||
      guia.game.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) =>
      filtro === 'populares' ? b.likes - a.likes : a.game.localeCompare(b.game)
    );
return (
    <Container className="lista-guias-page">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div>
          <h1 className="section-title">Guias da Comunidade</h1>
          <div className="section-line"></div>
        </div>
        <div>
          <CriarGuias
            buttonLabel="Crie seu próprio Guia!"
            buttonClassName="header-criar-btn"
            buttonVariant="outline-light"
            buttonSize="sm"
            onGuiaCriada={() => dispatch(fetchGuides())}
          />
        </div>
      </div>
      <div className="filtros-section d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
        <Form.Control
          type="text"
          placeholder="Buscar por jogo ou título..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="mb-3 mb-md-0 filtro-input"
        />
        <Form.Select
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="filtro-select"
        >
          <option value="populares">Mais populares</option>
          <option value="jogo">Por jogo</option>
        </Form.Select>
      </div>
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="light" /> Carregando guias...
        </div>
      ) : error ? (
        <div className="text-danger my-4">{error}</div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {guiasFiltrados.map(guia => (
            <Col key={guia.id}>
              <Card className="guia-card h-100 bg-dark text-light border-light">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="guia-title">{guia.title}</Card.Title>
                    <Card.Subtitle className="mb-2 guia-roadmap-preview">{guia.game}</Card.Subtitle>
                    {/* Se quiser mostrar o autor na listagem, descomente a linha abaixo */}
                    {/* <div className="mb-1 text-secondary" style={{ fontSize: 13 }}>Por: {guia.author}</div> */}
                    <Card.Text className="guia-roadmap-preview">
                      {guia.roadmap.length > 100
                        ? guia.roadmap.slice(0, 100) + '...'
                        : guia.roadmap}
                    </Card.Text>
                  </div>
                  <div className="guia-actions d-flex justify-content-between align-items-center mt-3">
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => navigate(`/guias/${guia.id}`)}
                    >
                      Ver detalhes
                    </Button>
                    <AvaliarGuias
                      guiaId={guia.id}
                      initialLikes={guia.likes}
                      initialComments={guia.comments?.length || 0}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}