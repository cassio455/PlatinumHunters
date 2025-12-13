import { useForm } from 'react-hook-form';
import { InputGroup, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signupUser } from '../../app/thunks/authThunks';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

const SignUp = () => {
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState("");
  const [signupError, setSignupError] = useState("");
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('user') || 'null') || null;
      navigate(user ? `/biblioteca/user/${user.id}` : '/biblioteca/user/1', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setSuccess("");
    setSignupError("");

    const result = await dispatch(signupUser({
      username: data.username,
      email: data.email,
      password: data.password,
    }));

    if (result.success) {
      setSuccess('Cadastro realizado com sucesso! Faça login para continuar.');
      reset();
      setTimeout(() => {
        navigate('/user/login', { replace: true });
      }, 2000);
    } else {
      setSignupError(result.error || 'Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <Card className="d-flex align-items-center justify-content-center mx-auto bg-dark-custom" style={{ minHeight: '80vh', maxWidth: '450px', width: '100%', marginTop: '5vh' }}>
      <Card.Body className="p-4 w-100">
        <h2 className="mb-4 text-center">Registrar-se</h2>
        {success && <Alert variant="success">{success}</Alert>}
        {signupError && <Alert variant="danger">{signupError}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Nome de usuário</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Digite seu nome de usuário"
                className="bg-dark text-white border-secondary custom-placeholder"
                {...register('username', { required: 'Nome de usuário obrigatório' })}
                isInvalid={!!errors.username}
                disabled={loading}
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {errors.username?.message}
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
                disabled={loading}
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
                {...register('password', {
                  required: 'Senha obrigatória',
                  minLength: { value: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
                })}
                isInvalid={!!errors.password}
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
            {loading ? 'Registrando...' : 'Registrar-se'}
          </Button>
        </Form>
        <Link to="/user/login" className="d-block mt-3 text-center">Já possui conta? Faça login</Link>
      </Card.Body>
    </Card>
  );
};
export default SignUp;