export const _serializeMeObj = async (obj) => {
  if (obj == undefined) {
    return null;
  }

  const connection = await window.Store.State.Socket.state;
  let PicThumb = undefined;

  if (!obj.id.contact.profilePicThumb) {
    PicThumb = await window.Store.ProfilePicThumb.get(obj.id.id._serialized);
  }

  return Object.assign(
    {},
    {
      id: obj.id.id,
      email: obj.id.email,
      description: obj.id.description,
      statusConnection: connection,
      businessHours: {
        timezone:
          obj.id.businessHours && obj.id.businessHours.timezone
            ? obj.id.businessHours.timezone
            : null
      },
      pushname:
        obj.id.contact && obj.id.contact.pushname
          ? obj.id.contact.pushname
          : null,
      website: obj.id.website,
      formattedTitle: obj.id.formattedTitle,
      categories: obj.id.categories,
      displayName: obj.id.contact.displayName,
      isBusiness: obj.id.contact.isBusiness,
      imgUrl:
        obj.id.contact &&
        obj.id.contact.profilePicThumb &&
        obj.id.contact.profilePicThumb.eurl
          ? obj.id.contact.profilePicThumb.eurl
          : PicThumb && PicThumb.eurl
          ? PicThumb.eurl
          : null,
      imgFull:
        obj.id.contact &&
        obj.id.contact.profilePicThumb &&
        obj.id.contact.profilePicThumb.imgFull
          ? obj.id.contact.profilePicThumb.imgFull
          : PicThumb && PicThumb.imgFull
          ? PicThumb.imgFull
          : null,
      previewEurl:
        obj.id.contact &&
        obj.id.contact.profilePicThumb &&
        obj.id.contact.profilePicThumb.previewEurl
          ? obj.id.contact.profilePicThumb.previewEurl
          : PicThumb && PicThumb.imgs
          ? PicThumb.imgs
          : null
    }
  );
};
