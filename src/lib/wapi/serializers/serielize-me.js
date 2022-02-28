export const _serializeMeObj = async (obj) => {
  if (obj == undefined) {
    return null;
  }

  const connection =
    window.Store &&
    window.Store.State &&
    window.Store.State.Socket &&
    window.Store.State.Socket.state
      ? window.Store.State.Socket.state
      : undefined;

  let PicThumb = undefined;
  if (
    obj &&
    obj.id &&
    obj.id.contact &&
    !obj.id.contact.profilePicThumb &&
    obj.id.id
  ) {
    PicThumb = await window.Store.ProfilePicThumb.get(obj.id.id._serialized);
  }

  const newObj = {};
  if (!obj.id) {
    return newObj;
  }

  Object.assign(newObj, {
    id: obj.id.id ? obj.id.id : null,
    email: obj.id.email ? obj.id.email : null,
    description: obj.id.description ? obj.id.description : null,
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
    website: obj.id.website ? obj.id.website : null,
    formattedTitle: obj.id.formattedTitle ? obj.id.formattedTitle : null,
    categories: obj.id.categories ? obj.id.categories : null,
    displayName:
      obj.id.contact && obj.id.contact.displayName
        ? obj.id.contact.displayName
        : null,
    isBusiness:
      obj.id.contact && obj.id.contact.isBusiness
        ? obj.id.contact.isBusiness
        : null,
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
  });
  const conn = Store.Me ? Store.Me : undefined;
  if (conn && conn.wid && conn.wid._serialized) {
    if (
      newObj.id &&
      newObj.id._serialized &&
      conn.wid &&
      conn.wid._serialized &&
      newObj.id._serialized === conn.wid._serialized &&
      conn.phone
    ) {
      Object.assign(newObj, {
        binVersion: conn.binVersion ? conn.binVersion : null,
        allLocales: conn.allLocales ? conn.allLocales : null,
        battery: conn.battery ? conn.battery : null,
        phone: {
          device_manufacturer: conn.phone.device_manufacturer
            ? conn.phone.device_manufacturer
            : null,
          device_model: conn.phone.device_model
            ? conn.phone.device_model
            : null,
          os_build_number: conn.phone.os_build_number
            ? conn.phone.os_build_number
            : null,
          os_version: conn.phone.os_version ? conn.phone.os_version : null,
          wa_version: conn.phone.wa_version ? conn.phone.wa_version : null
        }
      });
    }
  }
  return newObj;
};
