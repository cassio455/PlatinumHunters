import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputGroup, Form, Button, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MOCK_USER = {
  email: 'admin123@gmail.com',
  password: '12345678',
  token: 'TESTETESTE',
};

const Login = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === MOCK_USER.token) {
      navigate('/biblioteca');
    }
  }, [navigate]);

  const onSubmit = (data) => {
    if (data.email === MOCK_USER.email && data.password === MOCK_USER.password) {
      localStorage.setItem('token', MOCK_USER.token);
      navigate('/biblioteca');
    } else {
      setError('password', { type: 'manual', message: 'Credenciais inválidas.' });
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', maxWidth: '400px', width: '100%' }}>
        <Card.Body className="p-4">
          <h2 className="mb-4 text-center">Login</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  placeholder="Digite seu email"
                  className="bg-dark text-white border-secondary"
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
                  className="bg-dark text-white border-secondary"
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
        </Card.Body>
    </Container>
  );
};

export default Login;
