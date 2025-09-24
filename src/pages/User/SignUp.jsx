import { useForm } from 'react-hook-form';
import { InputGroup, Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MOCK_USER } from './userMock';
import { useState } from 'react';

const SignUp = () => {
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  // simulacao
  const onSubmit = (data) => {
    if (data.email === MOCK_USER.email) {
      setError('email', { type: 'manual', message: 'Email já cadastrado.' });
      return;
    }
    localStorage.setItem('token', MOCK_USER.token);
    setSuccess('Cadastro realizado com sucesso! Redirecionando...');
    setTimeout(() => {
      navigate('/main');
    }, 1500);
    reset();
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', maxWidth: '400px', width: '100%' }}>
        <Card.Body className="p-4">
          <h2 className="mb-4 text-center">Registrar</h2>
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Nome</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Digite seu nome"
                  className="bg-dark text-white border-secondary"
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
              Registrar
            </Button>
          </Form>
        </Card.Body>
    </Container>
  );
};
export default SignUp;