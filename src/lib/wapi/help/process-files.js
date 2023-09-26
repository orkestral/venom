export async function processFiles(chat, blobs) {
  if (!Array.isArray(blobs)) {
    blobs = [blobs];
  }

  const mediaCollection = new Store.MediaCollection({
    chatParticipantCount: chat.getParticipantCount()
  });

  console.log('MediaCollection', mediaCollection);
  console.log('Process', mediaCollection.processAttachments());
  console.log(Debug.VERSION);
  console.log('Chat: ', chat);

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
