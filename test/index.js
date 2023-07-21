const venom = require('../dist');


venom.create({
  session: 'sessionname', //name of session
  headless: true
}).then(()=> {
  start(client);
});

async function start(client) {
  // client.onMessage((message) => {
  //   console.log(message);
  // });
  // const allMessages = await client.getAllUnreadMessages();
  // console.log(allMessages);
}
