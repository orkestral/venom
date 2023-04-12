export const _serializeForcing = (obj) => {
  if (Array.isArray(obj) && obj.length && obj[0] && obj[0]._value) {
    const refactore = obj[0]._value;
    const newObj = {};
    Object.assign(newObj, {
      ack: refactore?.ack,
      body: refactore?.body,
      from: refactore?.from,
      id: refactore?.id,
      sender: refactore?.sender
    });
    return newObj;
  }

  return null;
};
