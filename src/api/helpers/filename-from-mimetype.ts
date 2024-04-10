import * as path from 'path'
import * as mime from 'mime-types'

export function filenameFromMimeType(
  filename: string,
  mimeType: string
): string {
  const filenameExtension = path.extname(filename)
  const mimeExtension = mime.extension(mimeType)

  if (!mimeExtension || filenameExtension === mimeExtension) {
    return filename
  }

  return path.basename(filename, filenameExtension) + '.' + mimeExtension
}
