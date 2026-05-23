import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import KanbanBoard from './KanbanBoard';

const PositionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <Container className="mt-4">
        <p role="alert" className="text-danger">
          Identificador de posición no válido
        </p>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4 px-3 px-lg-4">
      <KanbanBoard positionId={id} />
    </Container>
  );
};

export default PositionDetail;
