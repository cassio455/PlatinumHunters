import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {  useDispatch, useSelector } from 'react-redux';
import { fetchUserLibrary } from '../../app/thunks/libraryThunks';
import { InputGroup, Form, Button, Card } from 'react-bootstrap';
import LibraryStatus from '../../components/LibraryStatus';

const AdicionarJogo = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.library.loading);
  const error = useSelector((state) => state.library.error);
  
  const dispatch = useDispatch();
  useEffect(() => {
          dispatch(fetchUserLibrary(1));
      }, [dispatch]);

  if (loading || error) {
        return (
            <LibraryStatus
                loading={loading}
                loadingMessage="Carregando jogos..."
                error={!!error}
                errorMessage={error}
                onRetry={() => dispatch(fetchUserLibrary(1))}
                errorTitle="Erro ao carregar jogos da biblioteca"
            />
        );
    }
  return (
    <Card className="d-flex align-items-center justify-content-center mx-auto" style={{ minHeight: '80vh', maxWidth: '450px', width: '100%', marginTop: '5vh' }}>
      <Card.Body className="p-4 w-100">
        <h2 className="mb-4 text-center">Adicionar jogo a biblioteca</h2>
      </Card.Body>
    </Card>
  );

};
export default AdicionarJogo;