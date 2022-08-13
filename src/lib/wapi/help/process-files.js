export async function processFiles(chat, blobs) {
    if (!Array.isArray(blobs)) {
        blobs = [blobs];
    }

    const mediaCollection = new Store.MediaCollection({
        chatParticipantCount: chat.getParticipantCount(),
    });

    await mediaCollection.processAttachments(
        Debug.VERSION === '0.4.613' ?
        blobs :
        blobs.map((blob) => {
            return {
                file: blob,
            };
        }),
        chat,
        1
    );

    return mediaCollection;
}