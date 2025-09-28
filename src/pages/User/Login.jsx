import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputGroup, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../app/slices/authSlice';
import { MOCK_USER } from './userMock';
import { Link } from 'react-router-dom';
import './auth.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // fixing redirect loop
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/biblioteca', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    if (data.email === MOCK_USER.email && data.password === MOCK_USER.password) {
      localStorage.setItem('token', MOCK_USER.token);
      dispatch(loginSuccess({ token: MOCK_USER.token, user: MOCK_USER }));
      navigate('/biblioteca', { replace: true });
    } else {
      setError('password', { type: 'manual', message: 'Credenciais inválidas.' });
    }
  };

  return (
    <Card className="d-flex align-items-center justify-content-center mx-auto" style={{ minHeight: '80vh', maxWidth: '450px', width: '100%', marginTop: '5vh' }}>
      <Card.Body className="p-4 w-100">
        <h2 className="mb-4 text-center">Login</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
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
            Entrar
          </Button>
        </Form>
        <Link to="/user/signup" className="d-block mt-3 text-center">Não possui conta? Crie uma</Link>
      </Card.Body>
    </Card>
  );
};

export default Login;
