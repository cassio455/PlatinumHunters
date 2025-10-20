import React, { useState } from 'react'
import { Card, Button, Row, Col, Container, Form } from 'react-bootstrap'
import { guias } from './../guias.js'
import './ListaGuias.css'

export default function ListaGuias() {
  const [filtro, setFiltro] = useState('populares')
  const [busca, setBusca] = useState('')

  const guiasFiltrados = guias
    .filter(guia =>
      guia.title.toLowerCase().includes(busca.toLowerCase()) ||
      guia.game.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) =>
      filtro === 'populares' ? b.likes - a.likes : a.game.localeCompare(b.game)
    )

  return (
    <Container className="lista-guias-page">
      <h1 className="section-title">Guias da Comunidade</h1>
        <div className="section-line mb-4"></div>

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

      <Row xs={1} md={2} lg={3} className="g-4">
        {guiasFiltrados.map(guia => (
          <Col key={guia.id}>
            <Card className="guia-card h-100">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title className="guia-title">{guia.title}</Card.Title>
                  <Card.Subtitle className="mb-2 guia-roadmap-preview">{guia.game}</Card.Subtitle>
                  <Card.Text className="guia-roadmap-preview">
                    {guia.roadmap.length > 100
                      ? guia.roadmap.slice(0, 100) + '...'
                      : guia.roadmap}
                  </Card.Text>
                </div>
                <div className="guia-actions d-flex justify-content-between align-items-center mt-3">
                  <Button variant="outline-light" size="sm">
                    Ver detalhes
                  </Button>
                  <span className="guia-likes">❤️ {guia.likes}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
