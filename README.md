# 🕷Venom Bot🕸

[![npm version](https://img.shields.io/npm/v/venom-bot.svg?color=green)](https://www.npmjs.com/package/venom-bot)
![node](https://img.shields.io/node/v/venom-bot)
[![Downloads](https://img.shields.io/npm/dm/venom-bot.svg)](https://www.npmjs.com/package/venom-bot)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/orkestral/venom.svg)](http://isitmaintained.com/project/orkestral/venom 'Average time to resolve an issue')
[![Percentage of issues still open](http://isitmaintained.com/badge/open/orkestral/venom.svg)](http://isitmaintained.com/project/orkestral/venom 'Percentage of issues still open')
<a href="https://discord.gg/qCJ95FVbzR"><img src="https://img.shields.io/discord/772885202351292426?color=blueviolet&label=discord&style=flat" /></a>

[![Build Status](https://img.shields.io/github/actions/workflow/status/orkestral/venom/build.yml?branch=master)](https://github.com/orkestral/venom/actions)
[![Lint Status](https://img.shields.io/github/actions/workflow/status/orkestral/venom/lint.yml?branch=master&label=lint)](https://github.com/orkestral/venom/actions)
[![release-it](https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9A%80-release--it-e10079.svg)](https://github.com/release-it/release-it)

> Venom is a high-performance system developed with JavaScript to create a bot for WhatsApp, support for creating any interaction, such as customer service, media sending, sentence recognition based on artificial intelligence and all types of design architecture for WhatsApp.

## Get started fast and easy! Official API!

<p align="center">
  <a href="https://docs.orkestral.io/venom">Full Documentation</a>
</p>

<p>
It's a high-performance alternative API to whatsapp, you can send, text messages, files, images, videos and more.
</p>
<p>
Remember, the API was developed on a platform called RESTful Web services, providing interoperability between computer systems on the Internet.
</p>
<p>
It uses a set of well-defined operations that apply to all information resources: HTTP itself defines a small set of operations, the most important being POST, GET, PUT and DELETE.
</p>
<p>
Use it in your favorite language like PHP, Python, C# and others. as long as your language is supported with the HTTP protocol, you will save time and money. you don't need to know how Venom works, we have the complete API documentation, in a professional way!
</p>

## Get our official API Venom ! Contact us!

<a target="_blank" href="https://web.whatsapp.com/send?phone=5561985290357&text=I%20want%20access%20to%20API%20Venom" target="_blank"><img title="whatsapp" height="100" width="375" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/WhatsApp_logo.svg/2000px-WhatsApp_logo.svg.png"></a>

## Venom group support on Telegram

<a target="_blank" href="https://t.me/orkestral_oficial" target="_blank"><img title="Telegram" height="100" width="375" src="https://user-images.githubusercontent.com/66584466/117182238-7d1d8980-adac-11eb-9a70-e32f90c3d4e5.png"></a>

## Venom group support on Discord

<a target="_blank" href="https://discord.gg/uBRjk6vecs" target="_blank"><img title="Discord" height="110" width="375" src="https://s2.glbimg.com/GUbCgnBxJERAmuaYcrjBzTXD5ws=/0x0:800x272/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_63b422c2caee4269b8b34177e8876b93/internal_photos/bs/2021/d/N/zJs579QOGxKVRxfPILCA/discord-app.png"></a>

## Meet the Superchats

<br>
<a href='https://github.com/orkestral/superchats'><img src='https://github.com/orkestral/superchats/raw/main/img/superchats.png' height='60' alt='SuperChats' aria-label='https://github.com/orkestral/superchats' /></a>
<br>
<br>

**SuperChats** is a premium library with unique features that control Whatsapp functions with socket.
With Superchats you can build service bots, multiservice chats or any system that uses Whatsapp

**Superchats** is a premium version of **Venom**, with exclusive features and support for companies and developers worldwide
<br>
<a href='https://github.com/orkestral/superchats'>https://github.com/orkestral/superchats</a>

## Buy a license Superchats

The value of the license is $50 monthly dollars, to acquire contact in whatsapp by clicking on the image below !!

<a target="_blank" href="https://web.whatsapp.com/send?phone=5561985290357&text=I%20want%20to%20buy%201%20license" target="_blank"><img title="whatsapp" height="100" width="375" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/WhatsApp_logo.svg/2000px-WhatsApp_logo.svg.png"></a>

## 🕷🕷 Functions Venom🕷🕷

|                                                               |     |
| ------------------------------------------------------------- | --- |
| 🚻 Automatic QR Refresh                                       | ✔   |
| 📁 Send **text, image, video, audio and docs**                | ✔   |
| 👥 Get **contacts, chats, groups, group members, Block List** | ✔   |
| 📞 Send contacts                                              | ✔   |
| Send Buttons                                                  | ✔   |
| Send stickers                                                 | ✔   |
| Send stickers GIF                                             | ✔   |
| Multiple Sessions                                             | ✔   |
| ⏩ Forward Messages                                           | ✔   |
| 📥 Receive message                                            | ✔   |
| 👤 insert user section                                        | ✔   |
| 📍 Send location!!                                            | ✔   |
| 🕸🕸 **and much more**                                          | ✔   |

Documentation at https://orkestral.github.io/venom/index.html

## Installation

```bash
> npm i --save venom-bot
```

or for [Nightly releases](https://github.com/orkestral/venom/releases/tag/nightly):

```bash
> npm i --save https://github.com/orkestral/venom/releases/download/nightly/venom-bot-nightly.tgz
```

Installing the current repository "you can download the beta version from the current repository!"

```bash
> npm i github:orkestral/venom
```

## Getting started

```javascript
// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

venom
  .create({
    session: 'session-name' //name of session
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    if (message.body === 'Hi' && message.isGroupMsg === false) {
      client
        .sendText(message.from, 'Welcome Venom 🕷')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    }
  });
}
```

##### After executing `create()` function, **venom** will create an instance of whatsapp web. If you are not logged in, it will print a QR code in the terminal. Scan it with your phone and you are ready to go!

##### Venom will remember the session so there is no need to authenticate everytime.

##### Multiples sessions can be created at the same time by pasing a session name to `create()` function:

```javascript
// Init sales whatsapp bot
venom.create('sales').then((salesClient) => {...});

// Init support whatsapp bot
venom.create('support').then((supportClient) => {...});
```

<br>

## Optional create parameters

Venom `create()` method third parameter can have the following optional parameters:

If you are using the `Linux` server do not forget to pass the args `--user-agent`
[Original parameters in browserArgs](https://github.com/orkestral/venom/blob/master/src/config/puppeteer.config.ts)

```javascript
const venom = require('venom-bot');

venom
  .create(
    //session
    'sessionName', //Pass the name of the client you want to start the bot
    //catchQR
    (base64Qrimg, asciiQR, attempts, urlCode) => {
      console.log('Number of attempts to read the qrcode: ', attempts);
      console.log('Terminal qrcode: ', asciiQR);
      console.log('base64 image string qrcode: ', base64Qrimg);
      console.log('urlCode (data-ref): ', urlCode);
    },
    // statusFind
    (statusSession, session) => {
      console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser || initBrowser || openBrowser || connectBrowserWs || initWhatsapp || erroPageWhatsapp || successPageWhatsapp || waitForLogin || waitChat || successChat
      //Create session wss return "serverClose" case server for close
      console.log('Session name: ', session);
    },
    // options
    {
      browserPathExecutable: '', // browser executable path
      folderNameToken: 'tokens', //folder name when saving tokens
      mkdirFolderToken: '', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
      headless: 'new', // you should no longer use boolean false or true, now use false, true or 'new' learn more https://developer.chrome.com/articles/new-headless/
      devtools: false, // Open devtools by default
      debug: false, // Opens a debug session
      logQR: true, // Logs QR automatically in terminal
      browserWS: '', // If u want to use browserWSEndpoint
      browserArgs: [''], // Original parameters  ---Parameters to be added into the chrome browser instance
      addBrowserArgs: [''], // Add broserArgs without overwriting the project's original
      puppeteerOptions: {}, // Will be passed to puppeteer.launch
      disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
      disableWelcome: true, // Will disable the welcoming message which appears in the beginning
      updatesLog: true, // Logs info updates automatically in terminal
      autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
      createPathFileToken: false, // creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
      addProxy: [''], // Add proxy server exemple : [e1.p.webshare.io:01, e1.p.webshare.io:01]
      userProxy: '', // Proxy login username
      userPass: '' // Proxy password
    },

    // BrowserInstance
    (browser, waPage) => {
      console.log('Browser PID:', browser.process().pid);
      waPage.screenshot({ path: 'screenshot.png' });
    }
  )
  .then((client) => {
    start(client);
  })
  .catch((erro) => {
    console.log(erro);
  });
```

## Callback Status Session

Gets the return if the session is `isLogged` or `notLogged` or `browserClose` or `qrReadSuccess` or `qrReadFail` or `autocloseCalled` or `desconnectedMobile` or `deleteToken` or `chatsAvailable` or `deviceNotConnected` or `serverWssNotConnected` or `noOpenBrowser` or `initBrowser` or `openBrowser` or `connectBrowserWs` or `initWhatsapp` or `erroPageWhatsapp` or `successPageWhatsapp` or `waitForLogin` or `waitChat` or `successChat` or `Create session wss return "serverClose" case server for close`

| Status                  | Condition                                                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isLogged`              | When the user is already logged in to the browser                                                                                                              |
| `notLogged`             | When the user is not connected to the browser, it is necessary to scan the QR code through the cell phone in the option WhatsApp Web                           |
| `browserClose`          | If the browser is closed this parameter is returned                                                                                                            |
| `qrReadSuccess`         | If the user is not logged in, the QR code is passed on the terminal a callback is returned. After the correct reading by cell phone this parameter is returned |
| `qrReadFail`            | If the browser stops when the QR code scan is in progress, this parameter is returned                                                                          |
| `autocloseCalled`       | The browser was closed using the autoClose command                                                                                                             |
| `desconnectedMobile`    | Client has desconnected in to mobile                                                                                                                           |
| `serverClose`           | Client has desconnected in to wss                                                                                                                              |
| `deleteToken`           | If you pass true within the function                                                                                                                           |
| `chatsAvailable`        | When Venom is connected to the chat list                                                                                                                       |
| `deviceNotConnected`    | Chat not available because the phone is disconnected `(Trying to connect to the phone)`                                                                        |
| `serverWssNotConnected` | The address wss was not found!                                                                                                                                 |
| `noOpenBrowser`         | It was not found in the browser, or some command is missing in args                                                                                            |
| `initBrowser`           | Starting the browser                                                                                                                                           |
| `openBrowser`           | The browser has been successfully opened!                                                                                                                      |
| `connectBrowserWs`      | Connection with BrowserWs successfully done!                                                                                                                   |
| `initWhatsapp`          | Starting whatsapp!                                                                                                                                             |
| `erroPageWhatsapp`      | Error accessing whatsapp page                                                                                                                                  |
| `successPageWhatsapp`   | Page Whatsapp successfully accessed                                                                                                                            |
| `waitForLogin`          | Waiting for login verification!                                                                                                                                |
| `waitChat`              | Waiting for the chat to load                                                                                                                                   |
| `successChat`           | Chat successfully loaded!                                                                                                                                      |

```javascript
const venom = require('venom-bot');
venom
  .create('sessionName', undefined, (statusSession, session) => {
    console.log('Status Session: ', statusSession);
    //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser || initBrowser || openBrowser || connectBrowserWs || initWhatsapp || erroPageWhatsapp || successPageWhatsapp || waitForLogin || waitChat || successChat
    //Create session wss return "serverClose" case server for close
    console.log('Session name: ', session);
  })
  .then((client) => {
    start(client);
  })
  .catch((erro) => {
    console.log(erro);
  });
```

## Exporting QR Code

By default QR code will appear on the terminal. If you need to pass the QR
somewhere else heres how:

```javascript
const fs = require('fs');
const venom = require('venom-bot');

venom
  .create(
    'sessionName',
    (base64Qr, asciiQR, attempts, urlCode) => {
      console.log(asciiQR); // Optional to log the QR in the terminal
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      require('fs').writeFile(
        'out.png',
        imageBuffer['data'],
        'binary',
        function (err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    undefined,
    { logQR: false }
  )
  .then((client) => {
    start(client);
  })
  .catch((erro) => {
    console.log(erro);
  });
```

## Downloading Files

Puppeteer takes care of the file downloading. The decryption is being done as
fast as possible (outruns native methods). Supports big files!

```javascript
import fs = require('fs');
import mime = require('mime-types');

client.onMessage( async (message) => {
  if (message.isMedia === true || message.isMMS === true) {
    const buffer = await client.decryptFile(message);
    // At this point you can do whatever you want with the buffer
    // Most likely you want to write it into a file
    const fileName = `some-file-name.${mime.extension(message.mimetype)}`;
    fs.writeFile(fileName, buffer, (err) => {
      ...
    });
  }
});
```

## Basic Functions (usage)

Not every available function is listed, for further look, every function
available can be found in [here](/src/api/layers) and
[here](/src/lib/wapi/functions)

### Chatting

##### Here, `chatId` could be `<phoneNumber>@c.us` or `<phoneNumber>-<groupId>@g.us`

```javascript

// Send Poll
const poll = {
  name: 'new poll',
  options: [
    {
      name: 'option 1'
    },
    {
      name: 'option 2'
    }
  ],
  selectableOptionsCount: 1
};
await client.sendPollCreation('000000000000@c.us', poll)
.then((result) => {
    console.log('Result: ', result); //return object success
})
.catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
});

// Send List menu
const list = [
    {
      title: "Pasta",
      rows: [
        {
          title: "Ravioli Lasagna",
          description: "Made with layers of frozen cheese",
        }
      ]
    },
    {
      title: "Dessert",
      rows: [
        {
          title: "Baked Ricotta Cake",
          description: "Sweets pecan baklava rolls",
        },
        {
          title: "Lemon Meringue Pie",
          description: "Pastry filled with lemonand meringue.",
        }
      ]
    }
  ];

await client.sendListMenu('000000000000@c.us', 'Title', 'subTitle', 'Description', 'menu', list)
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Send Messages with Buttons Reply
const buttons = [
  {
    "buttonText": {
      "displayText": "Text of Button 1"
      }
    },
  {
    "buttonText": {
      "displayText": "Text of Button 2"
      }
    }
  ]
await client.sendButtons('000000000000@c.us', 'Title', 'Description', buttons)
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });
// Send audio file MP3
await client.sendVoice('000000000000@c.us', './audio.mp3').then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Send audio file base64
await client.sendVoiceBase64('000000000000@c.us', base64MP3)
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Send contact
await client
  .sendContactVcard('000000000000@c.us', '111111111111@c.us', 'Name of contact')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Send a list of contact cards
await client
  .sendContactVcardList('000000000000@c.us', [
    '111111111111@c.us',
    '222222222222@c.us',
  ])
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Send basic text
await client
  .sendText('000000000000@c.us', '👋 Hello from venom!')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });


// Send text message by injecting keystrokes into WhatsApp, thus maintaining the typing indicator
let success = await client.sendTextViaTyping('000000000000@c.us', '👋 Hello from venom!');

// Send photo or video by injecting keystrokes
let success = await client.sendPhotoVideoViaTyping('000000000000@c.us', 'path/to/file.jpg', 'Pretty sunset');

// Send location
await client
  .sendLocation('000000000000@c.us', '-13.6561589', '-69.7309264', 'Brasil')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Automatically sends a link with the auto generated link preview. You can also add a custom message to be added.
await client
  .sendLinkPreview(
    '000000000000@c.us',
    'https://www.youtube.com/watch?v=V1bFr2SWP1I',
    'Kamakawiwo ole'
  )
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Send image (you can also upload an image using a valid HTTP protocol)
await client
  .sendImage(
    '000000000000@c.us',
    'path/to/img.jpg',
    'image-name',
    'Caption text'
  )
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });


// Send image file base64
await client.sendImageFromBase64('000000000000@c.us', base64Image, "name file")
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Send file (venom will take care of mime types, just need the path)
// you can also upload an image using a valid HTTP protocol
await client
  .sendFile(
    '000000000000@c.us',
    'path/to/file.pdf',
    'file_name',
    'See my file in pdf'
  )
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Sends file
// base64 parameter should have mime type already defined
await client
  .sendFileFromBase64(
    '000000000000@c.us',
    base64PDF,
    'file_name.pdf',
    'See my file in pdf'
  )
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Generates sticker from the provided animated gif image and sends it (Send image as animated sticker)
// image path imageBase64 A valid gif and webp image is required. You can also send via http/https (http://www.website.com/img.gif)
await client
  .sendImageAsStickerGif('000000000000@c.us', './image.gif')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Generates sticker from given image and sends it (Send Image As Sticker)
// image path imageBase64 A valid png, jpg and webp image is required. You can also send via http/https (http://www.website.com/img.jpg)
await client
  .sendImageAsSticker('000000000000@c.us', './image.jpg')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Forwards messages
await client.forwardMessages(
  '000000000000@c.us',
  ['false_000000000000@c.us_B70847EE89E22D20FB86ECA0C1B11609','false_000000000000@c.us_B70847EE89E22D20FB86ECA0C1B11777']
).then((result) => {
    console.log('Result: ', result); //return object success
})
.catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
});

// Send @tagged message
await client.sendMentioned(
  '000000000000@c.us',
  'Hello @5218113130740 and @5218243160777!',
  ['5218113130740', '5218243160777']
);

// Reply to a message
await client.reply(
  '000000000000@c.us',
  'This is a reply!',
  'true_551937311025@c.us_7C22WHCB6DKYHJKQIEN9'
).then((result) => {
    console.log('Result: ', result); //return object success
}).catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
});

// Send message with options
await client.
        .sendMessageOptions(
          '000000000000@c.us',
          'This is a reply!',
           {
              quotedMessageId: reply,
            }
        )
        .then((retorno) => {
          resp = retorno;
        })
        .catch((e) => {
          console.log(e);
        });

// Send gif
await client.sendVideoAsGif(
  '000000000000@c.us',
  'path/to/video.mp4',
  'video.gif',
  'Gif image file'
);

//checks and returns whether a message and a reply
// exemple:
// await client.onMessage(async (message) => {
//     console.log(await client.returnReply(message)); // replicated message
//     console.log(message.body ); //customer message
//   })
checkReply = await client.returnReply(messagem);

// Send seen ✔️✔️
await client.sendSeen('000000000000@c.us');

// Start typing...
await client.startTyping('000000000000@c.us');

// Set chat state (0: Typing, 1: Recording, 2: Paused)
await client.setChatState('000000000000@c.us', 0 | 1 | 2);
```

## Retrieving Data

```javascript
// Retrieve all chats
const chats = await client.getAllChats();

//Retrieves all chats new messages
const chatsAllNew = getAllChatsNewMsg();

//Retrieves all chats Contacts
const contacts = await client.getAllChatsContacts();

//Retrieve all contacts new messages
const contactNewMsg = await client.getChatContactNewMsg();

// Retrieve all groups
// you can pass the group id optional use, exemple: client.getAllChatsGroups('00000000-000000@g.us')
const chats = await client.getAllChatsGroups();

//Retrieve all groups new messages
const groupNewMsg = await client.getChatGroupNewMsg();

//Retrieves all chats Transmission list
const transmission = await client.getAllChatsTransmission();

// Retrieve contacts
const contacts = await client.getAllContacts();

// Returns a list of mute and non-mute users
// "all" List all mutes
// "toMute" List all silent chats
// "noMute" List all chats without silence
const listMute = await client.getListMute('all');

// Calls your list of blocked contacts (returns an array)
const getBlockList = await client.getBlockList();

// Retrieve messages in chat
//chatID chat id
//includeMe will be by default true, if you do not want to pass false
//includeNotifications will be by default true, if you do not want to pass false
//const Messages = await client.getAllMessagesInChat(chatID, includeMe, includeNotifications)
const Messages = await client.getAllMessagesInChat('000000000000@c.us');

// Retrieve more chat message
const moreMessages = await client.loadEarlierMessages('000000000000@c.us');

// Retrieve all messages in chat
const allMessages = await client.loadAndGetAllMessagesInChat(
  '000000000000@c.us'
);

// Retrieve contact status
const status = await client.getStatus('000000000000@c.us');

// Retrieve user profile
// Please note that this function does not currently work due to a bug in WhatsApp itself.
// There is no telling if or when this function might work again.
const user = await client.getNumberProfile('000000000000@c.us');

// Retrieve all unread message
const messages = await client.getUnreadMessages();

// Retrieve profile fic (as url)
const url = await client.getProfilePicFromServer('000000000000@c.us');

// Retrieve chat/conversation
const chat = await client.getChat('000000000000@c.us');

// Check if the number exists
const chat = await client
  .checkNumberStatus('000000000000@c.us')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });
```

## Group Functions

```javascript
// groupId or chatId: leaveGroup 52123123-323235@g.us

//change group description
await client
  .setGroupDescription('00000000-000000@g.us', 'group description')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Leave group
await client.leaveGroup('00000000-000000@g.us');

// Get group members
await client.getGroupMembers('00000000-000000@g.us');

// Get group members ids
await client.getGroupMembersIds('00000000-000000@g.us');

// Generate group invite url link
await client.getGroupInviteLink('00000000-000000@g.us');

// Create group (title, participants to add)
await client.createGroup('Group name', [
  '111111111111@c.us',
  '222222222222@c.us'
]);

// Remove participant
await client.removeParticipant('00000000-000000@g.us', '111111111111@c.us');

// Add participant
await client.addParticipant('00000000-000000@g.us', '111111111111@c.us');

// Promote participant (Give admin privileges)
await client.promoteParticipant('00000000-000000@g.us', '111111111111@c.us');

// Demote particiapnt (Revoke admin privileges)
await client.demoteParticipant('00000000-000000@g.us', '111111111111@c.us');

// Get group admins
await client.getGroupAdmins('00000000-000000@g.us');

// Return the group status, jid, description from it's invite link
await client.getGroupInfoFromInviteLink(InviteCode);

// Join a group using the group invite code
await client.joinGroup(InviteCode);
```

## Profile Functions

```javascript
// Set client status
await client.setProfileStatus('On vacations! ✈️');

// Set client profile name
await client.setProfileName('Venom bot');

// Set client profile photo
await client.setProfilePic('path/to/image.jpg');

// Get device info
await client.getHostDevice();
```

## Device Functions

```javascript
// Disconnect from service
await client.logout();

// Delete the Service Worker
await client.killServiceWorker();

// Load the service again
await client.restartService();

// Get connection state
await client.getConnectionState();

// Get battery level
await client.getBatteryLevel();

// Is connected
await client.isConnected();

// Get whatsapp web version
await client.getWAVersion();
```

## Events

```javascript

//Listens to all new messages
//To receiver or recipient
client.onAnyMessage(message => {
  ...
};

// Listen to messages
client.onMessage(message => {
...
})

// Listen for messages that have been edited
client.onMessageEdit(message => {
...
})

// Listen for messages that have been deleted
client.onMessageDelete(message => {
...
})

// Listen to state changes
client.onStateChange(state => {
  ...
});

// Listen to ack's
// See the status of the message when sent.
// When receiving the confirmation object, "ack" may return a number, look {@link AckType} for details:
// -7 = MD_DOWNGRADE,
// -6 = INACTIVE,
// -5 = CONTENT_UNUPLOADABLE,
// -4 = CONTENT_TOO_BIG,
// -3 = CONTENT_GONE,
// -2 = EXPIRED,
// -1 = FAILED,
//  0 = CLOCK,
//  1 = SENT,
//  2 = RECEIVED,
//  3 = READ,
//  4 = PLAYED =

client.onAck(ack => {
  ...
});

// Listen to live location
// chatId: 'phone@c.us'
client.onLiveLocation("000000000000@c.us", (liveLocation) => {
  ...
});

// chatId looks like this: '5518156745634-1516512045@g.us'
// Event interface is in here: https://github.com/s2click/venom/blob/master/src/api/model/participant-event.ts
client.onParticipantsChanged("000000000000@c.us", (event) => {
  ...
});

// Listen when client has been added to a group
client.onAddedToGroup(chatEvent => {
  ...
});
```

## Other

```javascript
//Check if there is chat
await client
  .checkChat(chatId)
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Pin chat and Unpin chat messages with true or false
// Pin chat, non-existent (optional)
await client
  .pinChat(chatId, true, false)
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

///mute a contact
await client
  .sendMute(
    '000000000000@c.us', //contact mute
    30, //duration of silence, example: 30 minutes
    'minutes' ///kind of silence "hours" "minutes" "year"
  )
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

///unmute contact
await client
  .sendMute(
    '000000000000@c.us' //contact unmute
  )
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Change the theme
// string types "dark" or "light"
await client.setTheme('dark');

// Receive the current theme
// returns string light or dark
await client.getTheme();

// Delete chat
await client.deleteChat('000000000000@c.us');

// Clear chat messages
await client.clearChatMessages('000000000000@c.us');

// Archive and unarchive chat messages with true or false
await client.archiveChat(chatId, true);

// Delete message (last parameter: delete only locally)
await client
  .deleteMessage('000000000000@c.us', [
    'false_000000000000@c.us_B70847EE89E22D20FB86ECA0C1B11609',
    'false_000000000000@c.us_B70847EE89E22D20FB86ECA0C1B11777'
  ])
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

// Mark chat as not seen (returns true if it works)
await client.markUnseenMessage('000000000000@c.us');

// Blocks a user (returns true if it works)
await client.blockContact('000000000000@c.us');

// Unlocks contacts (returns true if it works)
await client.unblockContact('000000000000@c.us');
```

## Misc

There are some tricks for a better usage of venom.

#### Keep session alive:

```javascript
// function to detect conflits and change status
// Force it to keep the current session
// Possible state values:
// CONFLICT
// CONNECTED
// DEPRECATED_VERSION
// OPENING
// PAIRING
// PROXYBLOCK
// SMB_TOS_BLOCK
// TIMEOUT
// TOS_BLOCK
// UNLAUNCHED
// UNPAIRED
// UNPAIRED_IDLE
client.onStateChange((state) => {
  console.log('State changed: ', state);
  // force whatsapp take over
  if ('CONFLICT'.includes(state)) client.useHere();
  // detect disconnect on whatsapp
  if ('UNPAIRED'.includes(state)) console.log('logout');
});

// DISCONNECTED
// SYNCING
// RESUMING
// CONNECTED
let time = 0;
client.onStreamChange((state) => {
  console.log('State Connection Stream: ' + state);
  clearTimeout(time);
  if (state === 'DISCONNECTED' || state === 'SYNCING') {
    time = setTimeout(() => {
      client.close();
    }, 80000);
  }
});

// function to detect incoming call
client.onIncomingCall(async (call) => {
  console.log(call);
  client.sendText(call.peerJid, "Sorry, I still can't answer calls");
});
```

#### Closing (saving) sessions

Close the session properly to ensure the session is saved for the next time you
log in (So it won't ask for QR scan again). So instead of CTRL+C,

```javascript
// Catch ctrl+C
process.on('SIGINT', function() {
  client.close();
});

// Try-catch close
try {
   ...
} catch (error) {
   client.close();
}
```

### Auto closing unsynced sessions

The auto close is enabled by default and the timeout is set to 60 sec.
Receives the time in milliseconds to countdown until paired.

Use "autoClose: 0 | false" to disable auto closing.

### Debugging

### WhatsApp Web Versions

You can use cached versions of WhatsApp Web by passing the `webVersion` arguments as part of your venom options:
```javascript
venom.create({
    session: 'sessionname', //name of session
    headless: false,
    logQR: true,
    webVersion: '2.2402.5'
  })
  .then((client) => {
    start(client);
  });
```
This feature can use any version available in the list at https://github.com/wppconnect-team/wa-version/tree/main/html
## Development

Building venom is really simple although it contains 3 main projects inside

1. Wapi project

```bash
> npm run build:wapi
```

2. Middleware

```bash
> npm run build:middleware
> npm run build:jsQR
```

3. Venom

```bash
> npm run build:venom
```

To build the entire project just run

```bash
> npm run build
```

## Maintainers

Maintainers are needed, I cannot keep with all the updates by myself. If you are
interested please open a Pull Request.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.
