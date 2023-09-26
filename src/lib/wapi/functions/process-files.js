export async function processFiles(chat, blobs) {
  if (!Array.isArray(blobs)) {
    blobs = [blobs];
  }
  const mediaCollection = new Store.MediaCollection({
    chatParticipantCount: chat.getParticipantCount()
  });

  console.log('MediaCollection', mediaCollection);
  console.log(Debug.VERSION);

  await mediaCollection.processAttachments(
    Debug.VERSION === '0.4.613'
      ? blobs
      : blobs.map((blob) => {
          return {
            file: blob
          };
        }),
    chat,
    chat
  );
  return mediaCollection;
}
