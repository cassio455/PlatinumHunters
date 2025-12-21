import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { buyTitleAPI, equipTitleAPI, fetchTitlesList, saveTitleAPI, deleteTitleAPI } from "../app/thunks/shopThunks";
import { Modal, Form, Button } from 'react-bootstrap';
import { Pencil, Trash2, Plus } from 'lucide-react';
import "./Shop.css";

function Shop() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coins, ownedTitles, equippedTitle, availableTitles, loading } = useSelector((state) => state.shop);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ id: null, name: '', cost: 100 });

  useEffect(() => {
    dispatch(fetchTitlesList());
  }, [dispatch]);

  const handleBuyTitle = async (title) => {
    if (!isAuthenticated) { navigate('/user/login'); return; }
    if (coins < title.cost) { alert("Moedas insuficientes!"); return; }
    
    const result = await dispatch(buyTitleAPI({ name: title.name, cost: title.cost }));
    if (buyTitleAPI.fulfilled.match(result)) alert(`Você comprou: ${title.name}`);
    else alert(result.payload || "Erro na compra");
  };

  const handleEquipTitle = (title) => {
    if (!isAuthenticated) return;
    dispatch(equipTitleAPI(title.name));
  };

  const openCreateModal = () => {
      setModalData({ id: null, name: '', cost: 100 });
      setShowModal(true);
  };

  const openEditModal = (title) => {
      setModalData({ id: title._id, name: title.name, cost: title.cost });
      setShowModal(true);
  };

  const handleSave = async () => {
      if (!modalData.name || modalData.cost < 0) return alert("Preencha corretamente.");
      await dispatch(saveTitleAPI(modalData));
      setShowModal(false);
  };

  const handleDelete = async () => {
      if(confirm("Excluir este título da loja?")) {
          await dispatch(deleteTitleAPI(modalData.id));
          setShowModal(false);
      }
  };

  return (
    <div className="title-shop container mt-3 pt-5">
      <div className="d-flex justify-content-center align-items-center mb-2 position-relative">
          <h2 className="shop-title m-0">Loja de Títulos</h2>
          {isAuthenticated && (
              <button onClick={openCreateModal} className="btn btn-sm btn-outline-light position-absolute end-0" title="Criar Título">
                  <Plus size={20} />
              </button>
          )}
      </div>

      {isAuthenticated ? (
        <p className="points-display text-center" style={{ color: '#fa5f69', fontSize: '1.2rem', fontWeight: 'bold' }}>
          {user?.username}, suas moedas: {coins}
        </p>
      ) : (
        <p className="points-display text-center" style={{ color: '#ccc' }}>
          Faça login para comprar títulos!
        </p>
      )}

      <div className="shop-divider-line"></div>

      <Link to="/ranking" className="floating-ranking" aria-label="Abrir Rank">
        <i className="bi bi-arrow-left"></i>
      </Link>

      <div className="titles-grid mt-5">
        {availableTitles.length === 0 && <p className="text-center w-100">Nenhum título à venda.</p>}
        
        {availableTitles.map((title) => (
          <div key={title._id || title.id} className="title-card position-relative group-hover">
            {isAuthenticated && (
                <div className="position-absolute top-0 end-0 p-2" style={{ zIndex: 10 }}>
                    <Pencil 
                        size={16} 
                        className="cursor-pointer text-secondary hover-white" 
                        onClick={(e) => { e.stopPropagation(); openEditModal(title); }}
                    />
                </div>
            )}

            <h4>{title.name}</h4>
            <p>Custo: {title.cost} moedas</p>

            {ownedTitles.includes(title.name) ? (
              <button
                className={`equip-btn ${equippedTitle === title.name ? "equipped" : ""}`}
                onClick={() => handleEquipTitle(title)}
                disabled={!isAuthenticated}
              >
                {equippedTitle === title.name ? "Equipado" : "Equipar"}
              </button>
            ) : (
              <button 
                className="buy-btn" 
                onClick={() => handleBuyTitle(title)}
                disabled={!isAuthenticated || coins < title.cost}
                style={!isAuthenticated || coins < title.cost ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              >
                {isAuthenticated ? "Comprar" : "🔒 Login necessário"}
              </button>
            )}
          </div>
        ))}
      </div>

      {equippedTitle && isAuthenticated && (
        <p className="equipped-text">
          Título equipado: <span>{equippedTitle}</span>
        </p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
            <Modal.Title>{modalData.id ? "Editar Título" : "Novo Título"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Nome do Título</Form.Label>
                    <Form.Control 
                        type="text" value={modalData.name} 
                        onChange={(e) => setModalData({...modalData, name: e.target.value})}
                        className="bg-dark text-white border-secondary" placeholder="Ex: ⚔️ Guerreiro ⚔️"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Preço (Moedas)</Form.Label>
                    <Form.Control 
                        type="number" value={modalData.cost} 
                        onChange={(e) => setModalData({...modalData, cost: parseInt(e.target.value)})}
                        className="bg-dark text-white border-secondary"
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer className="border-secondary d-flex justify-content-between">
            {modalData.id && (
                <Button variant="outline-danger" onClick={handleDelete}><Trash2 size={16}/> Excluir</Button>
            )}
            <Button variant="primary" onClick={handleSave} style={{ backgroundColor: '#fa5f69', borderColor: '#fa5f69', marginLeft: 'auto' }}>
                Salvar
            </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Shop;