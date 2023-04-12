export const _serializeRawObj = (obj) => {
  if (obj?.toJSON) {
    obj.waveform = null;
    return obj.toJSON();
  }
  return {};
};
