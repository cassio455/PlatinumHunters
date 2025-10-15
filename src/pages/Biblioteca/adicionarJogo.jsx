import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { InputGroup, Form, Button, Card } from 'react-bootstrap';
const AdicionarJogo = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const fetchJogos = async () => {
    if (!user) return [];
    const res = await fetch(`http://localhost:3001/api/users/${user.id}/jogos`);
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    return res.json();
  };
  return (
    <Card className="d-flex align-items-center justify-content-center mx-auto" style={{ minHeight: '80vh', maxWidth: '450px', width: '100%', marginTop: '5vh' }}>
      <Card.Body className="p-4 w-100">
        <h2 className="mb-4 text-center">Adicionar Jogo</h2>
      </Card.Body>
    </Card>
  );

}
export default AdicionarJogo;