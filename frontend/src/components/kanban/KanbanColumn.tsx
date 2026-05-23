import React from 'react';
import type { InterviewStep, KanbanCandidate } from '../../types/kanban.types';
import CandidateCard, { parseDragPayload } from './CandidateCard';
import './kanban.css';

const DRAG_PAYLOAD_TYPE = 'application/x-kanban-candidate';

interface KanbanColumnProps {
  step: InterviewStep;
  candidates: KanbanCandidate[];
  onDrop: (
    candidateId: string,
    applicationId: string,
    stageId: number,
    stageName: string
  ) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ step, candidates, onDrop }) => {
  const headingId = `kanban-column-${step.id}`;

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    const raw =
      event.dataTransfer.getData(DRAG_PAYLOAD_TYPE) ||
      event.dataTransfer.getData('text/plain');
    const payload = parseDragPayload(raw);
    if (!payload) {
      return;
    }
    onDrop(payload.candidateId, payload.applicationId, step.id, step.name);
  };

  return (
    <section
      aria-labelledby={headingId}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="kanban-column"
    >
      <header className="mb-3">
        <h2 id={headingId} className="h6 text-uppercase text-muted mb-1">
          {step.name}
        </h2>
        <p className="small mb-0">{candidates.length} candidatos</p>
      </header>
      <div className="kanban-column__cards">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.applicationId} candidate={candidate} />
        ))}
      </div>
    </section>
  );
};

export default KanbanColumn;
