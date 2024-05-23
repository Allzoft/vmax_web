export interface Task {
  id_task: number;
  name: string;
  type_task: 'Subscripción' | 'Monetaria' | 'Recomendación' | 'Registrate';
  task_link: string;
  phaseIdPhase: number;
  orderId: number;
  userIdUser: number;
  is_completed: number;
}
