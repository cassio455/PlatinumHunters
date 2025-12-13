import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form, InputGroup } from 'react-bootstrap'
import './CriarGuias.css'

export default function CriarGuias({ buttonLabel = 'Criar Guia', buttonClassName = '', buttonVariant = 'primary', buttonSize = undefined }) {
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
      <Button className={`criar-guia-btn ${buttonClassName}`} variant={buttonVariant} size={buttonSize} onClick={() => setOpen(true)}>
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

              <div className="criar-guia-actions">
                <Button variant="outline-light" className="cancel-btn" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="outline-light" className="submit-btn">
                  Salvar Guia
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  )
}
