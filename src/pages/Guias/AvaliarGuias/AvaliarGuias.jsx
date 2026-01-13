import React, { useEffect, useState } from 'react';
import { FaHeart, FaComment } from 'react-icons/fa';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { CircleX } from 'lucide-react';
import './AvaliarGuias.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGuideDetails,
  likeGuide,
  addGuideComment,
  addGuideReply
} from '../../../app/thunks/guidesThunks';

export default function AvaliarGuias({ guiaId }) {
  const dispatch = useDispatch();
  const { guideDetails, loading } = useSelector(state => state.guides);
  const [showComments, setShowComments] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [replyParentId, setReplyParentId] = useState(null);
  const [replyTexto, setReplyTexto] = useState({});
  const [comentariosExpandido, setComentariosExpandido] = useState({});
  const [erro, setErro] = useState('');
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
useEffect(() => {
    dispatch(fetchGuideDetails(guiaId));
  }, [dispatch, guiaId, showComments]);
const handleLike = async () => {
    setLikeLoading(true);
    setErro('');
    try {
      await dispatch(likeGuide(guiaId)).unwrap();
    } catch (error) {
      setErro('Erro ao curtir/descurtir guia.');
    } finally {
      setLikeLoading(false);
    }
  };
const handleComment = () => setShowComments(true);
const handleClose = () => {
    setShowComments(false);
    setReplyParentId(null);
    setReplyTexto({});
  };
const adicionarComentario = async () => {
    if (!novoComentario.trim()) return;
    setCommentLoading(true);
    setErro('');
    try {
      await dispatch(addGuideComment({ id: guiaId, texto: novoComentario })).unwrap();
      setNovoComentario("");
    } catch (error) {
      setErro('Erro ao adicionar comentário.');
    } finally {
      setCommentLoading(false);
    }
  };
const adicionarReply = async (parentId) => {
    if (!replyTexto[parentId]?.trim()) return;
    setCommentLoading(true);
    setErro('');
    try {
      await dispatch(addGuideReply({ id: guiaId, commentId: parentId, texto: replyTexto[parentId] })).unwrap();
      setReplyParentId(null);
      setReplyTexto({ ...replyTexto, [parentId]: "" });
      setComentariosExpandido(exp => ({ ...exp, [parentId]: true }));
    } catch (error) {
      setErro('Erro ao adicionar resposta.');
    } finally {
      setCommentLoading(false);
    }
  };
const toggleReplies = (id) => {
    setComentariosExpandido(exp => ({ ...exp, [id]: !exp[id] }));
  };
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
            {com.author} <span style={{ fontWeight: "normal", color: "#aaa", fontSize: 12 }}>• {com.timestamp}</span>
          </div>
          <div style={{ margin: "8px 0" }}>{com.texto}</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {!isReply && (
              <Button
                className="comentario-btn"
                variant="outline-light"
                size="sm"
                onClick={() => {
                  setReplyParentId(com.id);
                  setReplyTexto({ ...replyTexto, [com.id]: "" });
                }}
              >
                Responder
              </Button>
            )}
            {!isReply && com.replies && com.replies.length > 0 && (
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
          {!isReply && replyParentId === com.id && (
            <Form style={{ marginTop: 10 }}
              onSubmit={e => {
                e.preventDefault();
                adicionarReply(com.id);
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
                    e.preventDefault();
                    adicionarReply(com.id);
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
                  disabled={commentLoading}
                >
                  {commentLoading ? <Spinner animation="border" size="sm" /> : "Adicionar resposta"}
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
          {!isReply && com.replies && com.replies.length > 0 && comentariosExpandido[com.id] && renderComentarios(com.replies, true, com.id)}
        </li>
      ))}
    </ul>
  );
if (loading || !guideDetails) {
    return (
      <div className="guia-actions-icons">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }
const guia = guideDetails;
return (
    <>
      <div className="guia-actions-icons">
        <div
          className="action-item"
          onClick={handleLike}
          role="button"
          aria-label="Curtir guia"
        >
          <FaHeart className="action-icon heart-icon" aria-hidden="true" />
          <span className="action-count">{guia.likes}</span>
          {likeLoading && <Spinner animation="border" size="sm" />}
        </div>
        <div
          className="action-item"
          onClick={handleComment}
          role="button"
          aria-label="Ver comentários"
        >
          <FaComment className="action-icon comment-icon" aria-hidden="true" />
          <span className="action-count">{guia.comments?.length || 0}</span>
        </div>
      </div>
      <Modal show={showComments} onHide={handleClose} centered dialogClassName="comentarios-modal-dark">
        <div className="modal-header comentarios-modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Modal.Title className="text-light" style={{ fontSize: 24 }}>Comentários da Guia</Modal.Title>
            <div style={{ color: "#f8f9fa", fontWeight: "bold", fontSize: 18, marginTop: 4 }}>
              {guia.title}
            </div>
          </div>
          <Button variant="link" style={{ color: "white", padding: 0 }} onClick={handleClose} aria-label="Fechar">
            <CircleX color="white" size={28} />
          </Button>
        </div>
        <Modal.Body className="comentarios-modal-body">
          <Form
            onSubmit={e => {
              e.preventDefault();
              adicionarComentario();
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
                  e.preventDefault();
                  adicionarComentario();
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
                disabled={commentLoading}
              >
                {commentLoading ? <Spinner animation="border" size="sm" /> : "Adicionar comentário"}
              </Button>
            )}
          </Form>
          <hr style={{ background: "#eee", margin: "12px 0" }} />
          {guia.comments && guia.comments.length === 0 ? (
            <div style={{ color: "#aaa" }}>Nenhum comentário ainda. Seja o primeiro!</div>
          ) : (
            guia.comments && renderComentarios(guia.comments)
          )}
          {erro && <div className="text-danger mt-2">{erro}</div>}
        </Modal.Body>
        <Modal.Footer className="comentarios-modal-footer">
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}