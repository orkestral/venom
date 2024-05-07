import axios from 'axios'
import { NotAllowedMimetype } from './not-allowed-mimetype.enum'
import { logger } from '../../utils/logger'

export async function downloadFileToBase64(
  _path: string,
  _mines: (string | RegExp)[] = []
): Promise<string | false> {
  if (!Array.isArray(_mines)) {
    logger.error(`set mines string array, not "${typeof _mines}" `)
    return false
  }

  const reHttp = /^https?:/

  if (!reHttp.test(_path)) {
    return false
  }

  try {
    const response = await axios.get(_path, {
      responseType: 'arraybuffer',
    })

    const mimeType = response.headers['content-type']

    if (mimeType.includes(NotAllowedMimetype.videoWebm)) {
      logger.error(`Content-Type "${mimeType}" of ${_path} is not allowed`)
      return false
    }
    
    if (_mines.length) {
      const isValidMime = _mines.some((m) => {
        if (typeof m === 'string') {
          return m === mimeType
        }
        return m.exec(mimeType)
      })
      if (!isValidMime) {
        logger.error(`Content-Type "${mimeType}" of ${_path} is not allowed`)
        return false
      }
    }

    const content = Buffer.from(response.data, 'binary').toString('base64')

    return `data:${mimeType};base64,${content}`
  } catch (error) {}

  return false
}
