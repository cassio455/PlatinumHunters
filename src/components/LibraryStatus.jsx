import React from 'react';
import { Container, Spinner, Button } from 'react-bootstrap';

const LibraryStatus = ({ loading, loadingMessage="Carregando", error, errorTitle="Erro",
    errorMessage="Ocorreu um erro inesperado.", onRetry
}) => {
    if(loading) {
        return (
            <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" variant='light' />
                <p className="mt-3">{loadingMessage}...</p>
            </Container>
        );
    }
    if(error){
        return (
            <Container className='py-5' style={{minHeight: '80vh'}}>
                <div className="alert alert-danger text-center">
                    <h4>{errorTitle}</h4>
                    <p>{errorMessage}</p>
                    {onRetry && (
                        <Button variant="secondary" onClick={onRetry}>
                Tentar Novamente
                        </Button>
                    )}
                </div>
            </Container>
        );
    }
    return null;
}
export default LibraryStatus;