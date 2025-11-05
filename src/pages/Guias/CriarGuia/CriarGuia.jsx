import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, Button, Form, InputGroup } from 'react-bootstrap'
import './CriarGuia.css'

export default function CriarGuia() {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      game: '',
      roadmap: ''
    }
  })

  const onSubmit = (data) => {
    console.log('Novo guia criado:', data)
    alert(`Guia "${data.title}" criado com sucesso!`)
    reset()
    setOpen(false)
  }

  return (
    <div className="criar-guia-page">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Criar Guia
      </Button>

      {open && (
        <div className="criar-guia-overlay" role="dialog" aria-modal="true">
          <Card
            className="d-flex align-items-center justify-content-center mx-auto"
            style={{
              minHeight: '80vh',
              maxWidth: '450px',
              width: '100%',
              marginTop: '5vh',
              padding: '20px'
            }}
          >
            <div className="w-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="m-0">Criar Guia de Platina</h4>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  ×
                </Button>
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
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
                  <Form.Label>Jogo</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Nome do jogo"
                      {...register('game', { required: 'O nome do jogo é obrigatório' })}
                      isInvalid={!!errors.game}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.game?.message}
                    </Form.Control.Feedback>
                  </InputGroup>
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

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="outline-light" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="outline-light">
                    Salvar Guia
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
