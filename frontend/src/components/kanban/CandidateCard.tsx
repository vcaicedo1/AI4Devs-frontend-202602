import React from 'react';
import type { KanbanCandidate } from '../../types/kanban.types';

const DRAG_PAYLOAD_TYPE = 'application/x-kanban-candidate';

export interface KanbanDragPayload {
  candidateId: string;
  applicationId: string;
}

interface CandidateCardProps {
  candidate: KanbanCandidate;
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

const scoreBadgeClass = (score: number | null): string => {
  if (score === null || score === undefined) {
    return 'bg-secondary';
  }
  if (Number.isNaN(score)) {
    return 'bg-secondary';
  }
  if (score >= 4) {
    return 'bg-success';
  }
  if (score >= 2.5) {
    return 'bg-warning text-dark';
  }
  return 'bg-danger';
};

const formatScoreLabel = (score: number | null): string => {
  if (score === null || score === undefined) {
    return 'Sin evaluar';
  }
  if (Number.isNaN(score)) {
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
      <div className="card-body py-2 px-3 d-flex justify-content-between align-items-start gap-2">
        <h3 className="h6 card-title mb-0">{candidate.fullName}</h3>
        <span className={`badge ${scoreBadgeClass(candidate.averageScore)}`}>
          {formatScoreLabel(candidate.averageScore)}
        </span>
      </div>
    </article>
  );
};

export default CandidateCard;
