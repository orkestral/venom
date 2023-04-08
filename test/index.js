import { create } from 'venom-bot';

create({
  session: 'session-name', //name of session
  multidevice: true // for version not multidevice use false.(default: true)
})
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {}
