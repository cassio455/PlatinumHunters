import { useForm } from 'react-hook-form';
import { InputGroup, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../../app/thunks/authThunks';
import { useState, useEffect } from 'react';
import './auth.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState("");
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setLoginError("");

    const result = await dispatch(loginUser({
      email: data.email,
      password: data.password
    }));

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setLoginError(result.error || 'Email ou senha inválidos.');
      setError('email', { type: 'manual', message: ' ' });
      setError('password', { type: 'manual', message: ' ' });
    }
  };

  return (
    <Card className="d-flex align-items-center justify-content-center mx-auto bg-dark-custom" style={{ minHeight: '80vh', maxWidth: '450px', width: '100%', marginTop: '5vh' }}>
      <Card.Body className="p-4 w-100">
        <h2 className="mb-4 text-center">Login</h2>
        {loginError && <Alert variant="danger">{loginError}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formEmailLogin">
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <Form.Control
                type="email"
                placeholder="Digite seu email"
                className="bg-dark text-white border-secondary custom-placeholder"
                {...register('email', { required: 'Email obrigatório' })}
                isInvalid={!!errors.email || !!loginError}
                disabled={loading}
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
                isInvalid={!!errors.password || !!loginError}
                disabled={loading}
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            variant="outline-light"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>
        <Link to="/user/signup" className="d-block mt-3 text-center">Não tem conta? Registre-se</Link>
      </Card.Body>
    </Card>
  );
};
export default Login;