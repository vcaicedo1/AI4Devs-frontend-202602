/** Paso del flujo de entrevistas (GET /positions/:id/interviewFlow → interviewFlow.interviewFlow.interviewSteps) */
export interface InterviewStepDTO {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

/** Flujo de entrevistas anidado dentro de PositionFlowDTO */
export interface InterviewFlowDetailsDTO {
  id: number;
  description: string | null;
  interviewSteps: InterviewStepDTO[];
}

/** Cuerpo de negocio del flujo por posición (servicio backend positionService) */
export interface PositionFlowDTO {
  positionName: string;
  interviewFlow: InterviewFlowDetailsDTO;
}

/** Respuesta HTTP envuelta por positionController.getInterviewFlowByPosition */
export interface GetInterviewFlowApiResponse {
  interviewFlow: PositionFlowDTO;
}

/** Candidato en tablero Kanban (GET /position/:id/candidates) */
export interface KanbanCandidateDTO {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number | null;
  id: number;
  applicationId: number;
}

/** Cuerpo esperado por PUT /candidates/:id/stage (alineado con api-spec: currentInterviewStep + applicationId) */
export interface UpdateCandidateStageRequestBody {
  applicationId: number;
  currentInterviewStep: number;
}

export interface ApplicationInterviewDTO {
  interviewDate: string;
  interviewStep: string;
  score: number | null;
}

/** Application devuelta en data tras actualizar etapa */
export interface ApplicationDataDTO {
  id: number;
  positionId: number;
  candidateId: number;
  applicationDate: string;
  currentInterviewStep: number;
  notes: string | null;
  interviews: ApplicationInterviewDTO[];
}

/** Respuesta HTTP de PUT /candidates/:id/stage */
export interface UpdateCandidateStageResponse {
  message: string;
  data: ApplicationDataDTO;
}
