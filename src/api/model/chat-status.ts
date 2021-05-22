export interface ChatStatus {
  id: ID;
  isGroup: string;
  isUser: string;
  type: string;
}

interface ID {
  server: string;
  user: string;
  _serialized: string;
}
