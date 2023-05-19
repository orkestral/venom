export async function encryptAndUploadFile(type, blob) {
  try {
    const filehash = await WAPI.getFileHash(blob);
    const mediaKey = WAPI.generateMediaKey(32);
    const controller = new AbortController();
    const signal = controller.signal;
    const encrypted = await Store.UploadUtils.encryptAndUpload({
      blob,
      type,
      signal,
      mediaKey
    });
    return {
      ...encrypted,
      clientUrl: encrypted.url,
      filehash,
      id: filehash,
      uploadhash: encrypted.encFilehash,
      mediaBlob: blob
    };
  } catch {
    return false;
  }
}
