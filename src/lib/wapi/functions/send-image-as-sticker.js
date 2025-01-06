import { base64ToFile } from '../helper/base64-to-file';
import { sendSticker } from './send-sticker';

/**
 * Sends image as sticker to given chat id
 * @param {string} imageBase64 Image as base64 A valid webp image is required.
 * @param {string} chatId chat id '000000000000@c.us'
 * @param {*} metadata about the image. Based on [sharp metadata](https://sharp.pixelplumbing.com/api-input#metadata)
 */
export async function sendImageAsSticker(imageBase64, chatId, metadata, type) {
  const mediaBlob = base64ToFile(
    'data:image/webp;base64,' + imageBase64,
    'file.webp'
  );
  let encrypted = await window.WAPI.encryptAndUploadFile('sticker', mediaBlob);

  return await sendSticker(encrypted, chatId, metadata, type);
}
