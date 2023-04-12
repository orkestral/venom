const mimeTypes = require('mime-types');
import * as fs from 'fs';

/**
 * Converts given file into base64 string
 * @param path file path
 * @param mime Optional, will retrieve file mime automatically if not defined (Example: 'image/png')
 */
export async function fileToBase64(path: string, mime?: string) {
  if (fs.existsSync(path)) {
    const base64 = fs.readFileSync(path, { encoding: 'base64' });
    if (mime === undefined) {
      mime = await mimeTypes.lookup(path);
    }
    const data = `data:${mime};base64,${base64}`;
    return data;
  } else {
    return false;
  }
}

export async function Mine(path: string) {
  if (fs.existsSync(path)) {
    const mime = await mimeTypes.lookup(path);
    return mime;
  } else {
    return false;
  }
}
