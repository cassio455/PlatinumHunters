import { useForm } from 'react-hook-form';
import { InputGroup, Form, Button, Card, Alert, Modal, Row, Col, Image } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { registerUser } from '../../app/thunks/authThunks'; 
import { useState, useEffect } from 'react';
import { User, Plus } from 'lucide-react';
import './auth.css';

const AVATAR_OPTIONS = [
  "https://i.pravatar.cc/150?img=11",
  "https://i.pravatar.cc/150?img=13", 
  "https://i.pravatar.cc/150?img=5",
];

const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [localError, setLocalError] = useState("");
  const { isAuthenticated, error: reduxError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      navigate(user ? `/biblioteca/user/${user.id}` : '/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setLocalError("");
    
    const finalAvatar = selectedAvatar || "https://i.pravatar.cc/150?img=68";

    const payload = {
        username: data.name, 
        email: data.email,
        password: data.password,
        profileImageUrl: finalAvatar
    };

    const success = await dispatch(registerUser(payload));
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '90vh', marginTop: '2vh' }}>
      <Card className="bg-dark-custom fade-in-up" style={{ maxWidth: '450px', width: '100%', border: '1px solid #333' }}>
        <Card.Body className="p-4">
          <h2 className="mb-2 text-center text-white">Criar Conta</h2>
          <p className="text-center text-secondary mb-4">Junte-se aos caçadores de troféus</p>
          
          <div className="d-flex justify-content-center mb-4">
            <div 
              className="position-relative cursor-pointer" 
              onClick={() => setShowAvatarModal(true)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden"
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  backgroundColor: '#2b2b2b', 
                  border: '3px solid #fa5f69',
                  boxShadow: '0 0 15px rgba(250, 95, 105, 0.3)'
                }}
              >
                {selectedAvatar ? (
                  <img src={selectedAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={40} color="#fa5f69" />
                )}
              </div>
              
              <div 
                className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: '#fa5f69',
                  bottom: '0',
                  right: '0',
                  border: '2px solid #1a1a1a'
                }}
              >
                <Plus size={18} color="white" />
              </div>
            </div>
          </div>

          {(reduxError || localError) && <Alert variant="danger">{reduxError || localError}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label className="text-light">Nome de Usuário</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Ex: HunterX"
                  className="bg-dark text-white border-secondary custom-placeholder"
                  {...register('name', { required: 'Nome obrigatório' })}
                  isInvalid={!!errors.name}
                />
              </InputGroup>
              <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className="text-light">Email</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-dark text-white border-secondary custom-placeholder"
                  {...register('email', { required: 'Email obrigatório' })}
                  isInvalid={!!errors.email}
                />
              </InputGroup>
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label className="text-light">Senha</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  placeholder="******"
                  className="bg-dark text-white border-secondary custom-placeholder"
                  {...register('password', { required: 'Senha obrigatória' })}
                  isInvalid={!!errors.password}
                />
              </InputGroup>
              <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </Form.Group>

            <Button 
                variant="primary" 
                type="submit" 
                className="w-100 py-2 fw-bold"
                style={{ 
                    backgroundColor: '#fa5f69', 
                    borderColor: '#fa5f69',
                    boxShadow: '0 4px 15px rgba(250, 95, 105, 0.4)' 
                }}
            >
              Criar Conta
            </Button>
          </Form>
          <Link to="/user/login" className="d-block mt-3 text-center text-decoration-none" style={{ color: '#aaa' }}>
            Já tem conta? <span style={{ color: '#fa5f69' }}>Faça login</span>
          </Link>
        </Card.Body>
      </Card>

      <Modal 
        show={showAvatarModal} 
        onHide={() => setShowAvatarModal(false)} 
        centered
        contentClassName="bg-dark text-white border-secondary"
      >
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title>Escolha seu Avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3 justify-content-center">
            {AVATAR_OPTIONS.map((url, index) => (
              <Col xs={4} sm={3} key={index} className="d-flex justify-content-center">
                <Image 
                  src={url} 
                  roundedCircle 
                  className="cursor-pointer avatar-option"
                  style={{ 
                    width: '70px', 
                    height: '70px', 
                    objectFit: 'cover',
                    border: selectedAvatar === url ? '3px solid #fa5f69' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onClick={() => {
                    setSelectedAvatar(url);
                    setShowAvatarModal(false);
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default SignUp;