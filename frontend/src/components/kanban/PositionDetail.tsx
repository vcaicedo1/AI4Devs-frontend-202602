import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import {
  getInterviewFlow,
  getKanbanCandidates,
  updateCandidateStage,
} from '../../services/positionService';
import type {
  InterviewStepDTO,
  KanbanCandidateDTO,
  PositionFlowDTO,
} from '../../types/kanban.types';
import KanbanColumn from './KanbanColumn';
import PositionHeader from './PositionHeader';

const sortSteps = (steps: InterviewStepDTO[]): InterviewStepDTO[] =>
  [...steps].sort((a, b) => a.orderIndex - b.orderIndex);

const PositionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [flow, setFlow] = useState<PositionFlowDTO | null>(null);
  const [candidates, setCandidates] = useState<KanbanCandidateDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBoard = useCallback(async (positionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const [flowData, candidatesData] = await Promise.all([
        getInterviewFlow(positionId),
        getKanbanCandidates(positionId),
      ]);
      setFlow(flowData);
      setCandidates(candidatesData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar el tablero';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setError('Identificador de posición no válido');
      setLoading(false);
      return;
    }
    void loadBoard(id);
  }, [id, loadBoard]);

  const steps = useMemo(
    () => sortSteps(flow?.interviewFlow.interviewSteps ?? []),
    [flow]
  );

  const candidatesByStep = useMemo(() => {
    const grouped = new Map<string, KanbanCandidateDTO[]>();
    steps.forEach((step) => grouped.set(step.name, []));
    candidates.forEach((candidate) => {
      const bucket = grouped.get(candidate.currentInterviewStep) ?? [];
      bucket.push(candidate);
      grouped.set(candidate.currentInterviewStep, bucket);
    });
    return grouped;
  }, [candidates, steps]);

  const handleDrop = useCallback(
    async (
      candidateId: string,
      applicationId: string,
      stageId: number,
      stageName: string
    ) => {
      const numericCandidateId = Number(candidateId);
      const previous = candidates.find((c) => c.id === numericCandidateId);
      if (!previous || previous.currentInterviewStep === stageName) {
        return;
      }

      setCandidates((current) =>
        current.map((c) =>
          c.id === numericCandidateId ? { ...c, currentInterviewStep: stageName } : c
        )
      );

      try {
        await updateCandidateStage(candidateId, String(stageId), applicationId);
      } catch (err) {
        setCandidates((current) =>
          current.map((c) =>
            c.id === numericCandidateId
              ? { ...c, currentInterviewStep: previous.currentInterviewStep }
              : c
          )
        );
        const message =
          err instanceof Error ? err.message : 'No se pudo actualizar la etapa';
        setError(message);
      }
    },
    [candidates]
  );

  if (loading) {
    return (
      <Container className="mt-4">
        <p role="status">Cargando tablero Kanban...</p>
      </Container>
    );
  }

  if (error && !flow) {
    return (
      <Container className="mt-4">
        <p role="alert" className="text-danger">
          {error}
        </p>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4 px-3 px-lg-4">
      <PositionHeader title={flow?.positionName ?? 'Posición'} />
      {error && <p role="alert" className="text-danger small">{error}</p>}
      <div
        className="d-flex flex-column flex-lg-row gap-3 w-100 pb-4"
        style={{ alignItems: 'stretch' }}
      >
        {steps.map((step) => (
          <KanbanColumn
            key={step.id}
            step={step}
            candidates={candidatesByStep.get(step.name) ?? []}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </Container>
  );
};

export default PositionDetail;
