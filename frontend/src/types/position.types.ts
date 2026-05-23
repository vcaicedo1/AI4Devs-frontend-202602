/** Vacante devuelta por GET /position */
export interface PositionListItemDTO {
  id: number;
  title: string;
  status: string;
  manager: string;
  applicationDeadline: string | null;
  location: string;
}
