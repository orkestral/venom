/**
 * Return messages by dates!
 * @param {string} id contact number id
 * @param {string} type 
  types:
  lowerThan: Return all messages before the date informed; 
  higherThan: Return all messages after the date informed;
  equal: Return all messages from the informed date;
  full: Return all messages, with two new stringdate parameters, dateNumeric;
 * @param {string} dateStart Pass the example date 00/00/0000 or 00-00-0000
 * @param {string} time Pass the example time 00:00 24 hours
 */
export async function getAllMessagesDate(
  id,
  type = 'full',
  dateStart = undefined,
  time = undefined,
  limit = 10,
  output = [],
  idCheck = [],
  stop = true
) {
  const types = ['higherThan', 'equal', 'lowerThan', 'full'];
  if (!types.includes(type)) {
    return WAPI.scope(
      undefined,
      true,
      null,
      `wrong type! use the types: ${types.join()}`
    );
  }

  if (!!time && dateStart === undefined) {
    return WAPI.scope(
      undefined,
      true,
      null,
      `it is necessary to inform the date field`
    );
  }

  const chat = await WAPI.sendExist(id);
  if (chat && chat.status != 404) {
    const statusMsg = chat.msgs.msgLoadState.noEarlierMsgs;
    if (statusMsg === false) {
      await chat.onEmptyMRM();
    }

    let messages = chat.msgs._models;
    let dateStartTimeStamp, msg;

    if (time !== undefined && dateStart !== undefined) {
      const splitTimeStart =
        typeof time === 'string' ? time.split(/[:]/) : undefined;
      const splitDateStart =
        typeof dateStart === 'string' ? dateStart.split(/[-,/]/) : undefined;
      dateStartTimeStamp = timeStampConvert(splitDateStart, splitTimeStart)
        ? timeStampConvert(splitDateStart, splitTimeStart)
        : false;
      if (dateStartTimeStamp === false || Number.isNaN(dateStartTimeStamp)) {
        const date = new Date();
        const year = date.toLocaleString('en-US', { year: 'numeric' });
        return WAPI.scope(
          undefined,
          true,
          null,
          `Date and time with invalid format! use as an example: data: 01/01/${year} or 01-01-${year} Tima 01:01`
        );
      }
    } else {
      if (dateStart !== undefined) {
        const splitDateStart =
          typeof dateStart === 'string' ? dateStart.split(/[-,/]/) : undefined;
        dateStartTimeStamp = timeStampConvert(splitDateStart)
          ? timeStampConvert(splitDateStart)
          : false;
        if (dateStartTimeStamp === false || Number.isNaN(dateStartTimeStamp)) {
          const date = new Date();
          const year = date.toLocaleString('en-US', { year: 'numeric' });
          return WAPI.scope(
            undefined,
            true,
            null,
            `Date with invalid format! use as an example: 01/01/${year} or 01-01-${year}`
          );
        }
      }
    }
    messages = messages.reverse();
    for (const i in messages) {
      if (i === 'remove') {
        continue;
      }
      if (output.length < limit || limit === 0) {
        const messageObj = messages[i];
        const message = await WAPI._serializeMessageObj(messageObj);
        if (message.id && idCheck.includes(message.id) === true) {
          continue;
        }

        if (type === 'higherThan') {
          if (
            parseInt(dateStartTimeStamp.getTime() / 1000) <= message.timestamp
          ) {
            msg = getMenssage(message);
          }
        }

        if (type === 'equal') {
          if (
            parseInt(dateStartTimeStamp.getTime() / 1000) === message.timestamp
          ) {
            msg = getMenssage(message);
          }
        }

        if (type === 'lowerThan') {
          if (
            parseInt(dateStartTimeStamp.getTime() / 1000) >= message.timestamp
          ) {
            msg = getMenssage(message);
          }
        }

        if (type === 'full') {
          msg = getMenssage(message);
        }

        if (msg && idCheck.includes(msg.id) === false) {
          stop = false;
          idCheck.push(msg.id);
          output.push(msg);
        }
      }
    }

    if (statusMsg === false && stop === false && output.length < limit) {
      return await getAllMessagesDate(
        id,
        type,
        dateStart,
        time,
        limit,
        output,
        idCheck,
        true
      );
    } else {
      return output;
    }
  } else {
    return chat;
  }
}

function timeStampConvert(date, time) {
  var newdate = undefined;
  if (date !== undefined) {
    if (time !== undefined) {
      newdate = new Date(date[2], date[1] - 1, date[0], time[0], time[1]);
    } else {
      newdate = new Date(date[2], date[1] - 1, date[0]);
    }
    return newdate;
  } else {
    return false;
  }
}

function getMenssage(message) {
  const date = new Date(message.timestamp * 1000);
  const stringdate = date.toLocaleString();

  const day = '0' + date.toLocaleString('en-US', { day: 'numeric' });
  const month = '0' + date.toLocaleString('en-US', { month: 'numeric' });
  const minutes = '0' + date.getUTCMinutes();
  const seconds = '0' + date.getSeconds();
  const hours = '0' + date.getHours();

  const _d = {
    id: message.id,
    timestamp: date.getTime(),
    stringdate,
    dateNumeric: {
      day: day.substr(-2),
      month: month.substr(-2),
      year: date.toLocaleString('en-US', { year: 'numeric' }),
      hours: hours.substr(-2),
      minutes: minutes.substr(-2),
      seconds: seconds.substr(-2)
    },
    type: message.type,
    fromMe: message.fromMe
  };
  return Object.assign(message, _d);
}
