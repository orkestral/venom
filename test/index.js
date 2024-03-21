const { tree } = require('gulp');
const venom = require('../dist');


venom.create({
    session: 'sessionname', //name of session
    headless: false,
    logQR: true,
    webVersion: '2.3000.1012170943-alpha'
  })
  .then((client) => {
    start(client);
  });

async function start(client) {

  const f = await client.getHostDevice();
  console.log(await client.getWAVersion());
  console.log(f);
  // client.onMessage((message) => {
  //   console.log(message);
  // });
  // const allMessages = await client.getAllUnreadMessages();
  // console.log(allMessages);
}
