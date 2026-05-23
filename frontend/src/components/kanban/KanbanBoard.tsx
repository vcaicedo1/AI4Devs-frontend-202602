import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import {
  getInterviewFlow,
  getKanbanCandidates,
  updateCandidateStage,
} from '../../services/positionService';
import type {
  InterviewStep,
  KanbanCandidate,
  PositionInterviewFlow,
} from '../../types/kanban.types';
import KanbanColumn from './KanbanColumn';
import PositionHeader from './PositionHeader';
import './kanban.css';

interface KanbanBoardProps {
  positionId: string;
}

const sortSteps = (steps: InterviewStep[]): InterviewStep[] =>
  [...steps].sort((a, b) => a.orderIndex - b.orderIndex);

const KanbanBoard: React.FC<KanbanBoardProps> = ({ positionId }) => {
  const [flow, setFlow] = useState<PositionInterviewFlow | null>(null);
  const [candidates, setCandidates] = useState<KanbanCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBoard = useCallback(async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  }, [positionId]);

  useEffect(() => {
    void loadBoard();
  }, [loadBoard]);

  const steps = useMemo(
    () => sortSteps(flow?.interviewFlow.interviewSteps ?? []),
    [flow]
  );

  const candidatesByStep = useMemo(() => {
    const grouped = new Map<string, KanbanCandidate[]>();
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

  if (isLoading) {
    return (
      <div className="text-center py-5" role="status">
        <Spinner animation="border" />
        <p className="mt-2 mb-0">Cargando tablero Kanban...</p>
      </div>
    );
  }

  if (error && !flow) {
    return (
      <p role="alert" className="text-danger">
        {error}
      </p>
    );
  }

  return (
    <>
      <PositionHeader title={flow?.positionName ?? 'Posición'} />
      {error && <p role="alert" className="text-danger small">{error}</p>}
      <div className="kanban-board">
        <div className="kanban-board__columns">
          {steps.map((step) => (
            <KanbanColumn
              key={step.id}
              step={step}
              candidates={candidatesByStep.get(step.name) ?? []}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default KanbanBoard;
