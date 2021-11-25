export const _serializeMeObj = async (obj) => {
  if (obj == undefined) {
    return null;
  }

  const connection = await window.Store.State.Socket.state;
  let PicThumb = undefined;
  if (!obj.id.contact.profilePicThumb) {
    PicThumb = await window.Store.ProfilePicThumb.get(obj.id.id._serialized);
  }
  const newObj = {};
  Object.assign(newObj, {
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
  });
  const conn = Store.Me ? Store.Me : undefined;
  if (conn && conn.wid && conn.wid._serialized) {
    if (newObj.id._serialized === conn.wid._serialized) {
      Object.assign(newObj, {
        binVersion: conn.binVersion,
        allLocales: conn.allLocales,
        battery: conn.battery,
        phone: {
          device_manufacturer: conn.phone.device_manufacturer,
          device_model: conn.phone.device_model,
          os_build_number: conn.phone.os_build_number,
          os_version: conn.phone.os_version,
          wa_version: conn.phone.wa_version
        }
      });
    }
  }
  return newObj;
};
