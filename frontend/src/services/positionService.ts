import { apiClient } from './apiClient';
import type {
  GetInterviewFlowApiResponse,
  KanbanCandidateDTO,
  PositionFlowDTO,
  UpdateCandidateStageResponse,
} from '../types/kanban.types';

export async function getInterviewFlow(positionId: string): Promise<PositionFlowDTO> {
  const response = await apiClient.get<GetInterviewFlowApiResponse>(
    `/position/${positionId}/interviewflow`
  );
  return response.interviewFlow;
}

export async function getKanbanCandidates(positionId: string): Promise<KanbanCandidateDTO[]> {
  return apiClient.get<KanbanCandidateDTO[]>(`/position/${positionId}/candidates`);
}

export async function updateCandidateStage(
  candidateId: string,
  newStageId: string,
  applicationId: string
): Promise<UpdateCandidateStageResponse> {
  return apiClient.put<UpdateCandidateStageResponse>(`/candidates/${candidateId}`, {
    applicationId: Number(applicationId),
    currentInterviewStep: Number(newStageId),
  });
}
