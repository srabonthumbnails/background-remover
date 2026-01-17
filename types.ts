
export interface ProcessingResult {
  originalUrl: string;
  resultUrl: string;
  prompt: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
