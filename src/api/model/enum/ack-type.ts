export enum AckType {
  MD_DOWNGRADE = -7,
  INACTIVE = -6,
  CONTENT_UNUPLOADABLE = -5,
  CONTENT_TOO_BIG = -4,
  CONTENT_GONE = -3,
  EXPIRED = -2,
  FAILED = -1,
  CLOCK = 0,
  SENT = 1,
  RECEIVED = 2,
  READ = 3,
  PLAYED = 4
}
