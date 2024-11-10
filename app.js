/* eslint-disable */
const venom = require('./dist/index');

try {
  venom
    .create({
      session: 'sessionName_0001',
      headless: false,
      devtools: true,
      useChrome: false,
    })
    .then((client) => start(client))
    .catch(async (err) => {
      console.log('Startup error: ' + err);
    });
} catch (e) {
  console.log(e);
}

async function start(client) {
  console.log('We have started');
  console.log(await client.getWAVersion());

  const page = client.waPage;
  const browser = page.browser();
  const pid = browser.process().pid;

  console.log(JSON.stringify(pid, null, 2));

  console.log(await client.isLoggedIn());
  const hostData = await client.getHost();
  if(hostData && hostData.id) {
    console.log(hostData.id);
  }


  let lastMessageId = "";

  client.onAnyMessage((message) => {
    if (lastMessageId === message.id) {
      console.log('Duplicate message: ' + lastMessageId)
    } else {
      lastMessageId = message.id;
      console.log(message);
      console.log('New message: ' + message.id + ' ' + message.type);
    }

    if (message['isGroupMsg']) {
      const ids = client
        .getGroupMembers(message['chatId'], 1000)
        .then((ids) => {
          console.log(ids);
        });
    }
  });

  client.onStateChange((state) => {
    console.log("State change: " + client.session);
    console.log("State change: " + state);
  })

  client.onStreamChange((stream) => {
    console.log("Stream change: " + client.session);
    console.log("Stream change: " + stream);
  })

  client.onMessageEdit((message) => {
    console.log('EDIT!');
    console.log(message);
  });

  client.onMessageDelete((message) => {
    console.log('DELETE!');
    console.log(message);
  });

  client.onMessageEdit((message) => {
    console.log('EDIT!');
    console.log(message);
  });

  client.onMessageReaction((reaction) => {
    console.log('REACTION!');
    console.log(reaction);
  });
}
