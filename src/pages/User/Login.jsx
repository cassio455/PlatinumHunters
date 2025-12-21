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
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px' }}>
      <Card className="bg-dark-custom shadow-lg" style={{ maxWidth: '450px', width: '100%', border: '1px solid #333', borderRadius: '15px' }}>
        <Card.Body className="p-4">
          <h2 className="mb-2 text-center text-white">Login</h2>
          <p className="text-center text-secondary mb-4">Bem-vindo de volta, caçador!</p>

          {loginError && <Alert variant="danger">{loginError}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formEmailLogin">
              <Form.Label className="text-light">Email</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  placeholder="seu@email.com"
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

            <Form.Group className="mb-4" controlId="formPasswordLogin">
              <Form.Label className="text-light">Senha</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  placeholder="******"
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
              variant="primary"
              type="submit"
              className="w-100 py-2 fw-bold"
              disabled={loading}
              style={{
                backgroundColor: '#fa5f69',
                borderColor: '#fa5f69',
                boxShadow: '0 4px 15px rgba(250, 95, 105, 0.4)'
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>
          <Link to="/user/signup" className="d-block mt-3 text-center text-decoration-none" style={{ color: '#aaa' }}>
            Não tem conta? <span style={{ color: '#fa5f69' }}>Registre-se</span>
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
};
export default Login;