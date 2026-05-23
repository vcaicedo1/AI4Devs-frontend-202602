import React from 'react';
import type { KanbanCandidateDTO } from '../../types/kanban.types';

const DRAG_PAYLOAD_TYPE = 'application/x-kanban-candidate';

export interface KanbanDragPayload {
  candidateId: string;
  applicationId: string;
}

interface CandidateCardProps {
  candidate: KanbanCandidateDTO;
}

export const serializeDragPayload = (payload: KanbanDragPayload): string =>
  JSON.stringify(payload);

export const parseDragPayload = (raw: string): KanbanDragPayload | null => {
  try {
    const parsed = JSON.parse(raw) as KanbanDragPayload;
    if (parsed.candidateId && parsed.applicationId) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

const formatScore = (score: number | null): string => {
  if (score === null || Number.isNaN(score)) {
    return 'Sin evaluar';
  }
  return score.toFixed(1);
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const handleDragStart = (event: React.DragEvent<HTMLElement>) => {
    const payload: KanbanDragPayload = {
      candidateId: String(candidate.id),
      applicationId: String(candidate.applicationId),
    };
    event.dataTransfer.setData(DRAG_PAYLOAD_TYPE, serializeDragPayload(payload));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      className="card shadow-sm mb-2 border-0"
    >
      <div className="card-body py-2 px-3">
        <h3 className="h6 card-title mb-1">{candidate.fullName}</h3>
        <p className="card-text small text-muted mb-0">
          Puntuación media: <strong>{formatScore(candidate.averageScore)}</strong>
        </p>
      </div>
    </article>
  );
};

export default CandidateCard;
