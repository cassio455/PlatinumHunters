import { useForm } from 'react-hook-form';
import { InputGroup, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../../app/thunks/authThunks';
import { useState, useEffect } from 'react';
import './auth.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, error: reduxError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true }); 
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    const success = await dispatch(loginUser({
      email: data.email,
      password: data.password
    }));
  };

  return (
    <Card className="d-flex align-items-center justify-content-center mx-auto bg-dark-custom" style={{ minHeight: '80vh', maxWidth: '450px', width: '100%', marginTop: '5vh' }}>
      <Card.Body className="p-4 w-100">
        <h2 className="mb-4 text-center">Login</h2>
        
        {reduxError && <Alert variant="danger">{reduxError}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formEmailLogin">
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

          <Form.Group className="mb-3" controlId="formPasswordLogin">
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
        <Link to="/user/signup" className="d-block mt-3 text-center">Não tem conta? Registre-se</Link>
      </Card.Body>
    </Card>
  );
};
export default Login;