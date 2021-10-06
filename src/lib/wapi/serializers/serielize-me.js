export const _serializeMeObj = async (obj) => {
  if (obj == undefined) {
    return null;
  }

  const status = await Store.MyStatus.getStatus(obj.wid._serialized);
  const appsImage = await Store.Profile.profilePicFind(obj.wid._serialized);
  const connection = await window.Store.State.default.state;
  
  return Object.assign(
    {},
    {
      battery: obj.battery,
      locales: obj.locales,
      statusConnection: connection,
      phone: {
        device_manufacturer: obj.phone.device_manufacturer,
        device_model: obj.phone.device_model,
        os_version: obj.phone.os_version,
        wa_version: obj.phone.wa_version,
      },
      pushname: obj.pushname,
      status: status.status,
      appsImage: appsImage && appsImage.eurl? appsImage.eurl: undefined,
      wid: {
        server: obj.wid.server,
        user: obj.wid.user,
        _serialized: obj.wid._serialized,
      },
    }
  );
};
