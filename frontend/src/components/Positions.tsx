import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getPositions } from '../services/positionService';
import type { PositionListItemDTO } from '../types/position.types';

type DisplayStatus = 'Abierto' | 'Contratado' | 'Cerrado' | 'Borrador';

const STATUS_LABELS: Record<string, DisplayStatus> = {
  Open: 'Abierto',
  Draft: 'Borrador',
  Closed: 'Cerrado',
  Filled: 'Contratado',
};

const mapStatusLabel = (status: string): DisplayStatus =>
  STATUS_LABELS[status] ?? 'Borrador';

const formatDeadline = (isoDate: string | null): string => {
  if (!isoDate) {
    return 'Sin fecha';
  }
  return new Date(isoDate).toLocaleDateString('es-ES');
};

const statusBadgeClass = (label: DisplayStatus): string => {
  switch (label) {
    case 'Abierto':
      return 'bg-warning';
    case 'Contratado':
      return 'bg-success';
    case 'Borrador':
      return 'bg-secondary';
    default:
      return 'bg-warning';
  }
};

const Positions: React.FC = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState<PositionListItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPositions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPositions();
        setPositions(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'No se pudieron cargar las posiciones';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadPositions();
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Posiciones</h2>
      <Row className="mb-4">
        <Col md={3}>
          <Form.Control type="text" placeholder="Buscar por título" />
        </Col>
        <Col md={3}>
          <Form.Control type="date" placeholder="Buscar por fecha" />
        </Col>
        <Col md={3}>
          <Form.Control as="select">
            <option value="">Estado</option>
            <option value="open">Abierto</option>
            <option value="filled">Contratado</option>
            <option value="closed">Cerrado</option>
            <option value="draft">Borrador</option>
          </Form.Control>
        </Col>
        <Col md={3}>
          <Form.Control as="select">
            <option value="">Manager</option>
          </Form.Control>
        </Col>
      </Row>

      {isLoading && (
        <div className="text-center py-5" role="status">
          <Spinner animation="border" />
          <p className="mt-2 mb-0">Cargando posiciones...</p>
        </div>
      )}

      {error && !isLoading && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}

      {!isLoading && !error && positions.length === 0 && (
        <p className="text-center text-muted">No hay posiciones visibles.</p>
      )}

      {!isLoading && !error && positions.length > 0 && (
        <Row>
          {positions.map((position) => {
            const statusLabel = mapStatusLabel(position.status);
            return (
              <Col md={4} key={position.id} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>{position.title}</Card.Title>
                    <Card.Text>
                      <strong>Manager:</strong> {position.manager}
                      <br />
                      <strong>Ubicación:</strong> {position.location}
                      <br />
                      <strong>Deadline:</strong> {formatDeadline(position.applicationDeadline)}
                    </Card.Text>
                    <span
                      className={`badge ${statusBadgeClass(statusLabel)} text-white`}
                    >
                      {statusLabel}
                    </span>
                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/positions/${position.id}`)}
                      >
                        Ver proceso
                      </Button>
                      <Button variant="secondary">Editar</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default Positions;
