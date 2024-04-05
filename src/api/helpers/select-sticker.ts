import sharp from 'sharp'

interface selectOutput {
  webpBase64: string
  metadata: {
    width?: number
    height?: number
  }
}

export async function stickerSelect(_B: Buffer, _t: number) {
  let _w: sharp.Sharp, _ins: Buffer
  switch (_t) {
    case 0:
      _ins = await sharp(_B, { failOnError: false })
        .resize({ width: 512, height: 512 })
        .toBuffer()
      _w = sharp(_ins, { failOnError: false }).webp()
      break
    case 1:
      _w = sharp(_B, { animated: true }).webp()
      break
    default:
      console.error('Enter a valid number 0 or 1')
      return false
  }

  const metadata = await _w.metadata()

  if (metadata.width > 512 || metadata.pageHeight > 512) {
    console.error(
      `Invalid image size (max 512x512):${metadata.width}x${metadata.pageHeight}`
    )
    return false
  }

  const obj: selectOutput = {
    webpBase64: (await _w.toBuffer()).toString('base64'),
    metadata: {
      width: metadata.width,
      height: metadata.pageHeight,
    },
  }

  return obj
}

interface CreateSize {
  width?: number
  height?: number
}
export async function resizeImg(buff: Buffer, size: CreateSize) {
  const _ins = await sharp(buff, { failOnError: false })
      .resize({ width: size.width, height: size.height })
      .toBuffer(),
    _w = sharp(_ins, { failOnError: false }).jpeg(),
    _webb64 = (await _w.toBuffer()).toString('base64')

  return _webb64
}
