const VPAT = /^\d+(\.\d+){0,2}$/;

/**
 * Compares two versions
 * @return true if local is up to date, false otherwise
 * @param local
 * @param remote
 */
export function upToDate(local: string, remote: string) {
  if (!local || !remote || local.length === 0 || remote.length === 0)
    return false;
  if (local == remote) return true;
  if (VPAT.test(local) && VPAT.test(remote)) {
    const lparts = local.split('.');
    while (lparts.length < 3) lparts.push('0');
    const rparts = remote.split('.');
    while (rparts.length < 3) rparts.push('0');
    for (let i = 0; i < 3; i++) {
      const l = parseInt(lparts[i], 10);
      const r = parseInt(rparts[i], 10);
      if (l === r) continue;
      return l > r;
    }
    return true;
  } else {
    return local >= remote;
  }
}
