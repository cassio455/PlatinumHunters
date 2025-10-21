import { useForm } from 'react-hook-form';
import { InputGroup, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../app/slices/authSlice';
import { MOCK_USER } from './userMock';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

const SignUp = () => {
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState("");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('user') || 'null') || null;
      navigate(user ? `/biblioteca/user/${user.id}` : '/biblioteca/user/1', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    if (data.email === MOCK_USER.email) {
      setError('email', { type: 'manual', message: 'Email já cadastrado.' });
      return;
    }
    localStorage.setItem('token', MOCK_USER.token);
    dispatch(loginSuccess({ token: MOCK_USER.token, user: MOCK_USER }));
    localStorage.setItem('user', JSON.stringify(MOCK_USER));
    setSuccess('Cadastro realizado com sucesso! Redirecionando...');
    setTimeout(() => {
      navigate(`/biblioteca/user/${MOCK_USER.id}`, { replace: true });
    }, 1500);
    reset();
  };

  return (
    <Card className="d-flex align-items-center justify-content-center mx-auto bg-dark-custom" style={{ minHeight: '80vh', maxWidth: '450px', width: '100%', marginTop: '5vh' }}>
      <Card.Body className="p-4 w-100">
        <h2 className="mb-4 text-center">Registrar-se</h2>
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Nome</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Digite seu nome"
                className="bg-dark text-white border-secondary custom-placeholder"
                {...register('name', { required: 'Nome obrigatório' })}
                isInvalid={!!errors.name}
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <Form.Control
                type="email"
                placeholder="Digite seu email"
                className="bg-dark text-white border-secondary custom-placeholder"
                {...register('email', { required: 'Email obrigatório' })}
                isInvalid={!!errors.email}
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Senha</Form.Label>
            <InputGroup>
              <Form.Control
                type="password"
                placeholder="Digite sua senha"
                className="bg-dark text-white border-secondary custom-placeholder"
                {...register('password', { required: 'Senha obrigatória' })}
                isInvalid={!!errors.password}
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="outline-light" type="submit" className="w-100">
            Registra-se
          </Button>
        </Form>
        <Link to="/user/login" className="d-block mt-3 text-center">Já possui conta? Faça login</Link>
      </Card.Body>
    </Card>
  );
};
export default SignUp;