import React from 'react';
import type { InterviewStepDTO, KanbanCandidateDTO } from '../../types/kanban.types';
import CandidateCard, { parseDragPayload } from './CandidateCard';

const DRAG_PAYLOAD_TYPE = 'application/x-kanban-candidate';

interface KanbanColumnProps {
  step: InterviewStepDTO;
  candidates: KanbanCandidateDTO[];
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
      className="d-flex flex-column bg-light border rounded p-3 flex-grow-1 w-100"
      style={{ minHeight: '280px', minWidth: '0' }}
    >
      <header className="mb-3">
        <h2 id={headingId} className="h6 text-uppercase text-muted mb-1">
          {step.name}
        </h2>
        <p className="small mb-0">{candidates.length} candidatos</p>
      </header>
      <div className="d-flex flex-column flex-grow-1">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.applicationId} candidate={candidate} />
        ))}
      </div>
    </section>
  );
};

export default KanbanColumn;
