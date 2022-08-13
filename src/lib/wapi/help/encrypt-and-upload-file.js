export async function encryptAndUploadFile(type, blob) {
  try {
    const filehash = await API.getFileHash(blob);
    const mediaKey = API.generateMediaKey(32);
    const controller = new AbortController();
    const signal = controller.signal;
    const encrypted = await window.Store.UploadUtils.encryptAndUpload({
      blob,
      type,
      signal,
      mediaKey,
    });
    return {
      ...encrypted,
      clientUrl: encrypted.url,
      filehash,
      id: filehash,
      uploadhash: encrypted.encFilehash,
      mediaBlob: blob,
    };
  } catch {
    return false;
  }
}
