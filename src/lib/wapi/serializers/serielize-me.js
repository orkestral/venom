export const _serializeMeObj = async (obj) => {
  if (obj == undefined) {
    return null;
  }
  const status = await Store.MyStatus.getStatus(obj.wid._serialized);
  const image = await Store.Profile.profilePicFindThumbFromPhone(
    obj.wid._serialized
  );
  const appsImage = Store.Profile.profilePicFind(obj.wid._serialized);
  return Object.assign(
    {},
    {
      battery: obj.battery,
      connected: obj.connected,
      locales: obj.locales,
      phone: {
        device_manufacturer: obj.phone.device_manufacturer,
        device_model: obj.phone.device_model,
        os_version: obj.phone.os_version,
        wa_version: obj.phone.wa_version
      },
      pushname: obj.pushname,
      status: status.status,
      imageBase64: image.raw,
      appsImage: appsImage.eurl,
      wid: {
        server: obj.wid.server,
        user: obj.wid.user,
        _serialized: obj.wid._serialized
      }
    }
  );
};
