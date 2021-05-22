export interface GroupCreation {
  status: number;
  gid: {
    server: string;
    user: string;
    _serialized: string;
  };
  participants: { [key: string]: any[] }[];
}
