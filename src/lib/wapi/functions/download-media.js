export async function downloadMedia(messageId) {
  const msg = await WAPI.getMessageById(messageId, null, false)

  if (!msg) {
    throw {
      error: true,
      code: 'message_not_found',
      message: 'Message not found',
    }
  }
  if (!msg.mediaData) {
    throw {
      error: true,
      code: 'message_not_contains_media',
      message: 'Message not contains media',
    }
  }

  await msg.downloadMedia(true, 1)

  let blob = null

  if (msg.mediaData.mediaBlob) {
    blob = msg.mediaData.mediaBlob.forceToBlob()
  } else if (msg.mediaData.filehash) {
    blob = Store.BlobCache.get(msg.mediaData.filehash)
  }

  // Transform a VIDEO message to a DOCUMENT message
  if (!blob && msg.mediaObject.type && msg.mediaObject.type === 'VIDEO') {
    delete msg.mediaObject.type
    msg.type = 'document'
    return downloadMedia(messageId)
  }

  if (!blob) {
    throw {
      error: true,
      code: 'media_not_found',
      message: 'Media not found',
    }
  }

  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = function () {
      resolve(reader.result)
    }
    reader.onabort = reject
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
