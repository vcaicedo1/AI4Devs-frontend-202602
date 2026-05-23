import { apiClient } from './apiClient';
import {
  KANBAN_API_PATHS,
  type GetInterviewFlowResponse,
  type KanbanCandidate,
  type PositionInterviewFlow,
  type UpdateCandidateStageBody,
  type UpdateCandidateStageResponse,
} from '../types/kanban.types';
import type { PositionListItemDTO } from '../types/position.types';

export async function getPositions(): Promise<PositionListItemDTO[]> {
  return apiClient.get<PositionListItemDTO[]>('/position');
}

export async function getInterviewFlow(positionId: string): Promise<PositionInterviewFlow> {
  const response = await apiClient.get<GetInterviewFlowResponse>(
    KANBAN_API_PATHS.interviewFlow(positionId)
  );
  return response.interviewFlow;
}

export async function getKanbanCandidates(positionId: string): Promise<KanbanCandidate[]> {
  const candidates = await apiClient.get<KanbanCandidate[]>(
    KANBAN_API_PATHS.candidates(positionId)
  );
  return candidates.map((candidate) => ({
    ...candidate,
    averageScore: normalizeAverageScore(candidate.averageScore),
  }));
}

export async function updateCandidateStage(
  candidateId: string,
  newStageId: string,
  applicationId: string
): Promise<UpdateCandidateStageResponse> {
  const body: UpdateCandidateStageBody = {
    applicationId: Number(applicationId),
    currentInterviewStep: Number(newStageId),
  };
  return apiClient.put<UpdateCandidateStageResponse>(
    KANBAN_API_PATHS.updateStage(candidateId),
    body
  );
}

/** El backend envía 0 cuando no hay entrevistas puntuadas; la UI usa null para "Sin evaluar" */
const normalizeAverageScore = (score: number | null): number | null => {
  if (score === null || Number.isNaN(score)) {
    return null;
  }
  return score === 0 ? null : score;
};
