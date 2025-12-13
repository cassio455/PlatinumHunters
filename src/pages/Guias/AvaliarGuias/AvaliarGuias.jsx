import React, { useState } from 'react'
import { FaHeart, FaComment } from 'react-icons/fa'
import { Modal, Button, Form } from 'react-bootstrap'
import { CircleX} from 'lucide-react'
import './AvaliarGuias.css'
import { guias } from "../guias"

function getTimeNow() {
  return "agora"
}

export default function AvaliarGuias({ guiaId, initialLikes = 0, initialComments = 0, onLike }) {
  const guia = guias.find(g => g.id === guiaId)
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comentarios, setComentarios] = useState(guia.comentarios ?? [])
  const [novoComentario, setNovoComentario] = useState("")
  const [replyParentId, setReplyParentId] = useState(null)
  const [replyTexto, setReplyTexto] = useState({})
  const [comentariosExpandido, setComentariosExpandido] = useState({})
  const [likedComments, setLikedComments] = useState({})
  const [likedReplies, setLikedReplies] = useState({})

  const handleLike = () => {
    const newLikeCount = isLiked ? likes - 1 : likes + 1
    setLikes(newLikeCount)
    setIsLiked(!isLiked)
    if (onLike) onLike({ guiaId, likes: newLikeCount, isLiked: !isLiked })
  }

  const handleComment = () => setShowComments(true)
  const handleClose = () => {
    setShowComments(false)
    setReplyParentId(null)
    setReplyTexto({})
  }

  const adicionarComentario = () => {
    if (!novoComentario.trim()) return
    const novo = {
      id: Date.now(),
      autor: "Você",
      texto: novoComentario,
      likes: 0,
      timestamp: getTimeNow(),
      replies: []
    }
    setComentarios([novo, ...comentarios])
    setNovoComentario("")
  }

  const curtirComentario = (id, parentId = null) => {
    if (parentId === null) {
      setLikedComments(prev => ({
        ...prev,
        [id]: !prev[id]
      }))
      setComentarios(comentarios =>
        comentarios.map(c => {
          if (c.id === id) {
            return { ...c, likes: likedComments[id] ? c.likes - 1 : c.likes + 1 }
          }
          return c
        })
      )
    } else {
      setLikedReplies(prev => ({
        ...prev,
        [id]: !prev[id]
      }))
      setComentarios(comentarios =>
        comentarios.map(c => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: c.replies.map(r =>
                r.id === id
                  ? { ...r, likes: likedReplies[id] ? r.likes - 1 : r.likes + 1 }
                  : r
              )
            }
          }
          return c
        })
      )
    }
  }

  const adicionarReply = (parentId) => {
    if (!replyTexto[parentId]?.trim()) return
    setComentarios(comentarios =>
      comentarios.map(c => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [
              ...c.replies,
              {
                id: Date.now(),
                autor: "Você",
                texto: replyTexto[parentId],
                likes: 0,
                timestamp: getTimeNow(),
              }
            ]
          }
        }
        return c
      })
    )
    setReplyParentId(null)
    setReplyTexto({ ...replyTexto, [parentId]: "" })
    setComentariosExpandido(exp => ({ ...exp, [parentId]: true }))
  }

  const toggleReplies = (id) => {
    setComentariosExpandido(exp => ({ ...exp, [id]: !exp[id] }))
  }

  const renderComentarios = (lista, isReply = false, parentId = null) => (
    <ul className="comentarios-lista">
      {lista.map(com => (
        <li
          key={com.id}
          className={`comentario-item${isReply ? " comentario-reply" : ""}`}
          style={{
            marginBottom: isReply ? 13 : 18,
            ...(isReply ? { borderLeft: "3px solid #444", paddingLeft: 18 } : {}),
          }}
        >
          <div style={{ fontWeight: "bold" }}>
            {com.autor} <span style={{ fontWeight: "normal", color: "#aaa", fontSize: 12 }}>• {com.timestamp}</span>
          </div>
          <div style={{ margin: "8px 0" }}>{com.texto}</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Button
              className={`comentario-btn${(parentId === null ? likedComments[com.id] : likedReplies[com.id]) ? " liked" : ""}`}
              variant={((parentId === null ? likedComments[com.id] : likedReplies[com.id])) ? "danger" : "outline-light"}
              size="sm"
              onClick={() => curtirComentario(com.id, parentId)}
            >
              <FaHeart style={{ color: ((parentId === null ? likedComments[com.id] : likedReplies[com.id])) ? "#fff" : "#e74c3c" }} />
              <span>{com.likes}</span>
            </Button>
            {/* Só comentários principais têm botão de responder */}
            {!isReply && (
              <Button
                className="comentario-btn"
                variant="outline-light"
                size="sm"
                onClick={() => {
                  setReplyParentId(com.id)
                  setReplyTexto({ ...replyTexto, [com.id]: "" }) // Limpa texto ao abrir nova caixa
                }}
              >
                Responder
              </Button>
            )}
            {/* Só comentários principais podem ter replies */}
            {!isReply && com.replies.length > 0 && (
              <Button
                className="comentario-btn"
                variant="link"
                size="sm"
                style={{ color: "#aaa", textDecoration: "underline" }}
                onClick={() => toggleReplies(com.id)}
              >
                {comentariosExpandido[com.id] ? `Esconder respostas (${com.replies.length})` : `Ver todas as respostas (${com.replies.length})`}
              </Button>
            )}
          </div>
          {/* campo reply: só para comentários principais */}
          {!isReply && replyParentId === com.id && (
            <Form style={{ marginTop: 10 }}
              onSubmit={e => {
                e.preventDefault()
                adicionarReply(com.id)
              }}>
              <Form.Control
                as="textarea"
                rows={2}
                className="comentario-form"
                placeholder="Adicione uma resposta..."
                value={replyTexto[com.id] || ""}
                onChange={e => setReplyTexto({ ...replyTexto, [com.id]: e.target.value })}
                style={{
                  background: "#181818",
                  color: "#fff",
                  border: "1px solid #eee",
                  resize: "vertical"
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    adicionarReply(com.id)
                  }
                }}
              />
              {replyTexto[com.id]?.trim() && (
                <Button
                  className="btn-adicionar-dark"
                  variant="dark"
                  size="sm"
                  style={{ marginTop: 4 }}
                  onClick={() => adicionarReply(com.id)}
                >
                  Adicionar resposta
                </Button>
              )}
              <Button
                variant="link"
                size="sm"
                style={{ color: "#aaa", marginLeft: 8 }}
                onClick={() => setReplyParentId(null)}
              >
                Cancelar
              </Button>
            </Form>
          )}
          {/* replies: só para comentários principais */}
          {!isReply && com.replies.length > 0 && comentariosExpandido[com.id] && renderComentarios(com.replies, true, com.id)}
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <div className="guia-actions-icons">
        <div
          className="action-item"
          onClick={handleLike}
          role="button"
          aria-label={isLiked ? 'Descurtir guia' : 'Curtir guia'}
        >
          <FaHeart className={`action-icon heart-icon ${isLiked ? 'liked' : ''}`} aria-hidden="true" />
          <span className="action-count">{likes}</span>
        </div>
        <div
          className="action-item"
          onClick={handleComment}
          role="button"
          aria-label="Ver comentários"
        >
          <FaComment className="action-icon comment-icon" aria-hidden="true" />
          <span className="action-count">{comentarios.length}</span>
        </div>
      </div>

      <Modal show={showComments} onHide={handleClose} centered dialogClassName="comentarios-modal-dark">
        <div className="modal-header comentarios-modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Modal.Title className="text-light" style={{ fontSize: 24 }}>Comentários da Guia</Modal.Title>
            {/* Título da guia */}
            <div style={{ color: "#f8f9fa", fontWeight: "bold", fontSize: 18, marginTop: 4 }}>
              {guia.title}
            </div>
          </div>
          {/* Botão de X da Lucid */}
          <Button variant="link" style={{ color: "white", padding: 0 }} onClick={handleClose} aria-label="Fechar">
            <CircleX  color="white" size={28} />
          </Button>
        </div>
        <Modal.Body className="comentarios-modal-body">
          <Form
            onSubmit={e => {
              e.preventDefault()
              adicionarComentario()
            }}>
            <Form.Control
              as="textarea"
              rows={2}
              className="comentario-form"
              placeholder="Adicione um comentário..."
              value={novoComentario}
              onChange={e => setNovoComentario(e.target.value)}
              style={{
                background: "#181818",
                color: "#fff",
                border: "1px solid #eee",
                resize: "vertical"
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  adicionarComentario()
                }
              }}
            />
            {novoComentario.trim() && (
              <Button
                className="btn-adicionar-dark"
                variant="dark"
                size="sm"
                style={{ marginTop: 4 }}
                onClick={adicionarComentario}
              >
                Adicionar comentário
              </Button>
            )}
          </Form>
          <hr style={{ background: "#eee", margin: "12px 0" }} />
          {comentarios.length === 0 ? (
            <div style={{ color: "#aaa" }}>Nenhum comentário ainda. Seja o primeiro!</div>
          ) : (
            renderComentarios(comentarios)
          )}
        </Modal.Body>
        <Modal.Footer className="comentarios-modal-footer">
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
