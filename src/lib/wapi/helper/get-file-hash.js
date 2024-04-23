import * as jsSHA from '../jssha'
export async function getFileHash(data) {
  const buffer = await data.arrayBuffer()
  var sha = new jsSHA('SHA-256', 'ARRAYBUFFER')
  sha.update(buffer)
  return sha.getHash('B64')
}
