/**
 * Group properties
 */
export enum GroupSettings {
  /**
   * Define how can send message in the group
   * `true` only admins
   * `false` everyone
   */
  ANNOUNCEMENT = 'announcement',

  /**
   * Define how can edit the group data
   * `true` only admins
   * `false` everyone
   */
  RESTRICT = 'restrict',

  /**
   * Non-Documented
   */
  NO_FREQUENTLY_FORWARDED = 'no_frequently_forwarded',

  /**
   * Enable or disable temporary messages
   * `true` to enable
   * `false` to disable
   */
  EPHEMERAL = 'ephemeral',
}
