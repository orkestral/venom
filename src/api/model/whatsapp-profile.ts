import { Id } from './id';

export interface WhatsappProfile {
  id: Id;
  status: number;
  isBusiness: boolean;
  canReceiveMessage: boolean;
  numberExists: boolean;
}
