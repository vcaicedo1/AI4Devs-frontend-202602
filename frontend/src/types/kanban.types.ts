/**
 * Contratos TypeScript del módulo Kanban (LTI).
 * Alineados con el enunciado y la respuesta real del backend Express.
 *
 * Endpoints del enunciado:
 * - GET  /positions/:id/interviewFlow
 * - GET  /positions/:id/candidates
 * - PUT  /candidates/:id/stage
 */

/** Rutas de API del Kanban (contrato del enunciado) */
export const KANBAN_API_PATHS = {
  interviewFlow: (positionId: string | number) =>
    `/positions/${positionId}/interviewFlow`,
  candidates: (positionId: string | number) => `/positions/${positionId}/candidates`,
  updateStage: (candidateId: string | number) => `/candidates/${candidateId}/stage`,
} as const;

/** Paso del flujo de entrevistas (interviewSteps dentro del flujo) */
export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

/** Flujo de entrevistas asociado a la posición */
export interface InterviewFlowDetails {
  id: number;
  description: string | null;
  interviewSteps: InterviewStep[];
}

/** Payload de negocio de GET .../interviewFlow (tras desenvolver la respuesta HTTP) */
export interface PositionInterviewFlow {
  positionName: string;
  interviewFlow: InterviewFlowDetails;
}

/**
 * Respuesta HTTP de GET /positions/:id/interviewFlow
 * El controller envuelve el servicio en { interviewFlow: PositionInterviewFlow }
 */
export interface GetInterviewFlowResponse {
  interviewFlow: PositionInterviewFlow;
}

/** Candidato mostrado en el tablero Kanban (GET /positions/:id/candidates) */
export interface KanbanCandidate {
  /** ID del candidato */
  id: number;
  /** ID de la aplicación (requerido para PUT .../stage) */
  applicationId: number;
  fullName: string;
  /** Nombre del paso actual (interviewStep.name) */
  currentInterviewStep: string;
  /**
   * Media de puntuaciones de entrevistas.
   * El backend devuelve `number` (0 si no hay entrevistas con score).
   * Se tipa como `number | null` para la UI ("Sin evaluar").
   */
  averageScore: number | null;
}

/** Cuerpo de PUT /candidates/:id/stage */
export interface UpdateCandidateStageBody {
  applicationId: number;
  currentInterviewStep: number;
}

export interface ApplicationInterview {
  interviewDate: string;
  interviewStep: string;
  score: number | null;
}

export interface ApplicationRecord {
  id: number;
  positionId: number;
  candidateId: number;
  applicationDate: string;
  currentInterviewStep: number;
  notes: string | null;
  interviews: ApplicationInterview[];
}

/** Respuesta HTTP de PUT /candidates/:id/stage */
export interface UpdateCandidateStageResponse {
  message: string;
  data: ApplicationRecord;
}

/** Type guard: puntuación evaluada y usable en comparaciones o formateo */
export const hasEvaluatedAverageScore = (
  score: number | null | undefined
): score is number =>
  score !== null && score !== undefined && !Number.isNaN(score);

/** Indica si la puntuación debe mostrarse como no disponible en la UI */
export const isAverageScoreUnavailable = (
  score: number | null | undefined
): score is null | undefined => !hasEvaluatedAverageScore(score);

/** Alias históricos (compatibilidad con imports existentes) */
export type InterviewStepDTO = InterviewStep;
export type InterviewFlowDetailsDTO = InterviewFlowDetails;
export type PositionFlowDTO = PositionInterviewFlow;
export type GetInterviewFlowApiResponse = GetInterviewFlowResponse;
export type KanbanCandidateDTO = KanbanCandidate;
export type UpdateCandidateStageRequestBody = UpdateCandidateStageBody;
export type ApplicationInterviewDTO = ApplicationInterview;
export type ApplicationDataDTO = ApplicationRecord;
