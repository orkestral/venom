export interface Scope {
  erro: boolean;
  to: string;
  text: string;
}

function infoType(data: string, type: string) {
  return typeof data === type ? true : false;
}
export function checkValuesSender(data: any) {
  if (Array.isArray(data)) {
    for (let i in data) {
      if (typeof i == 'number') {
        let result =
          data[i].type && data[i].value && infoType(data[i].value, data[i].type)
            ? true
            : !data[i].value && data[i].isUser === false
            ? true
            : false;
        if (!result) {
          return {
            erro: true,
            param: data[i].param,
            function: data[i].function,
            text: `Invalid parameter in ${data[i].param}! Pass a variable of type ${data[i].type}!`
          };
        }
      }
    }
    return true;
  } else {
    console.error('Error: checkValuesSender is not array');
  }
}
