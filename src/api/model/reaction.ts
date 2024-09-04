export interface Reaction {
  id: ReactionKey;
  from: string;
  to: string;
  type: string;
  t: number;
  ack: number;
  author: string;
  notifyName: string;
  invis: boolean;
  count: number;
  kind: string;
  reactionParentKey: ReactionKey;
  reactionText: string;
  reactionTimestamp: number;
  read: boolean;
}

export interface ReactionKey {
  fromMe: boolean;
  remote: string;
  id: string;
  participant: string;
  _serialized: string;
}
