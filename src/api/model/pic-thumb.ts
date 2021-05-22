export interface PicTumb {
  attributes: Attributes;
  eurl: string;
  eurlStale: boolean;
  fallbackType: string;
  id: ID;
  img: string;
  imgFull: string;
  isState: boolean;
  pendingPic: any;
  raw: any;
  stale: boolean;
  tag: string;
  token: string;
}

interface Attributes {
  eurl: string;
  eurlStale: boolean;
  id: ID;
  pendingPic: any;
  raw: any;
  stale: boolean;
  tag: string;
  token: string;
}

interface ID {
  server: string;
  user: string;
  _serialized: string;
}
