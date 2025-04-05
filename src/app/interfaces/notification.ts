export interface Notification {
  id?: number;
  icon: string;
  message: string;
  time: string;
  type: 'factory_request' | 'registration' | 'factory_update';
  studentName?: string;
  factoryName?: string;
}
