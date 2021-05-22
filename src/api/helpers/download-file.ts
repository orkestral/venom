import axios from 'axios';

export async function downloadFileToBase64(
  _path: string,
  _mines: (string | RegExp)[] = []
): Promise<string | false> {
  if (!Array.isArray(_mines)) {
    console.error(`set mines string array, not "${typeof _mines}" `);
    return false;
  }

  const reHttp = /^https?:/;

  if (!reHttp.test(_path)) {
    return false;
  }

  try {
    const response = await axios.get(_path, {
      responseType: 'arraybuffer',
    });

    const mimeType = response.headers['content-type'];
    if (_mines.length) {
      const isValidMime = _mines.some((m) => {
        if (typeof m === 'string') {
          return m === mimeType;
        }
        return m.exec(mimeType);
      });
      if (!isValidMime) {
        console.error(`Content-Type "${mimeType}" of ${_path} is not allowed`);
        return false;
      }
    }

    const content = Buffer.from(response.data, 'binary').toString('base64');

    return `data:${mimeType};base64,${content}`;
  } catch (error) {}

  return false;
}
