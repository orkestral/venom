# 🕷Venom Bot🕸

> Venom is a high-performance system developed with JavaScript to create a bot for WhatsApp, support for creating any interaction, such as customer service, media sending, sentence recognition based on artificial intelligence and all types of design architecture for WhatsApp.

### Summary

- [Installation](#installation)
- [Getting start](#getting-started)
    - [Multi sessions](#multi-sessions)
    - [Passing options to create](#passing-options-on-create)
        - [Callback Status Session](#callback-status-session)
        - [Exporting QR Code](#exporting-qr-code)
- [Basic Functions (usage)](#basic-functions-usage)
    - [Chatting](#chatting)
        - [sendContactVcard](#sendcontactvcard)
        - [sendContactVcardList](#sendcontactvcardlist)
        - [sendText](#sendtext)
        - [sendLocation](#sendlocation)
        - [sendLinkPreview](#sendlinkpreview)
        - [sendImage](#sendimage)
        - [sendFile](#sendfile)
        - [sendFileFromBase64](#sendfilefrombase64)
        - [sendImageAsStickerGif](#sendimageasstickergif)
        - [sendImageAsSticker](#sendimageassticker)
        - [sendMentioned](#sendmentioned)
        - [reply](#reply)
        - [reply with mention](#reply-with-mention)
        - [sendMessageOptions](#sendmessageoptions)
        - [sendVideoAsGif](#sendvideoasgif)
        - [forwardMessages](#forwardmessages)
        - [sendSeen](#sendseen)
        - [startTyping](#starttyping)
        - [stopTyping](#stoptyping)
        - [setChatState](#setchatstate)

### Installation

The first thing that you had to do is install the `npm package`:

```bash
npm i --save venom-bot
```

## Getting started

To start using `Venom Bot`, you need to create a file and call the `create` method.\
That method returns an `Promise`.

```javascript
// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

venom
  .create()
  .then((client) => start(client))
  .catch((error) => console.log(error));
```

### Multi sessions

If you want to start more than one session, for example, 
in case you have different departments in your project, 
then you had to specify it in your code like in that example:

```javascript
// Init sales whatsapp bot
venom.create('sales').then((client) => startClient(client));

// Init support whatsapp bot
venom.create('support').then((client) => startSupport(client));
```

### Passing options on create

The `create` method third parameter can have the following optional parameters:

```javascript
venom.create(
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
      console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
      //Create session wss return "serverClose" case server for close
      console.log('Session name: ', session);
    },
    // options
    {
      folderNameToken: 'tokens', //folder name when saving tokens
      mkdirFolderToken: '', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
      headless: true, // Headless chrome
      devtools: false, // Open devtools by default
      useChrome: true, // If false will use Chromium instance
      debug: false, // Opens a debug session
      logQR: true, // Logs QR automatically in terminal
      browserWS: '', // If u want to use browserWSEndpoint
      browserArgs: [''], // Parameters to be added into the chrome browser instance
      puppeteerOptions: {}, // Will be passed to puppeteer.launch
      disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
      disableWelcome: true, // Will disable the welcoming message which appears in the beginning
      updatesLog: true, // Logs info updates automatically in terminal
      autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
      createPathFileToken: false, //creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
    },
    // BrowserSessionToken
    // To receive the client's token use the function await clinet.getSessionTokenBrowser()
    {
      WABrowserId: '"UnXjH....."',
      WASecretBundle:
        '{"key":"+i/nRgWJ....","encKey":"kGdMR5t....","macKey":"+i/nRgW...."}',
      WAToken1: '"0i8...."',
      WAToken2: '"1@lPpzwC...."',
    }
  )
  .then((client) => start(client))
  .catch((error) => console.log(error));
```

#### Callback Status Session

Gets the return if the session is `isLogged` or `notLogged` or `browserClose` 
or `qrReadSuccess` or `qrReadFail` or `autocloseCalled` or `desconnectedMobile` 
or `deleteToken` or `Create session wss return "serverClose" case server for close`

| Status               | Condition                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isLogged`           | When the user is already logged in to the browser                                                                                                              |
| `notLogged`          | When the user is not connected to the browser, it is necessary to scan the QR code through the cell phone in the option WhatsApp Web                           |
| `browserClose`       | If the browser is closed this parameter is returned                                                                                                            |
| `qrReadSuccess`      | If the user is not logged in, the QR code is passed on the terminal a callback is returned. After the correct reading by cell phone this parameter is returned |
| `qrReadFail`         | If the browser stops when the QR code scan is in progress, this parameter is returned                                                                          |
| `autocloseCalled`    | The browser was closed using the autoClose command                                                                                                             |
| `desconnectedMobile` | Client has disconnected in to mobile                                                                                                                           |
| `serverClose`        | Client has disconnected in to wss                                                                                                                              |
| `deleteToken`        | If you pass true within the function `client.getSessionTokenBrowser(true)`                                                                                     |

```javascript
const venom = require('venom-bot');
venom
  .create(
    'sessionName',
    undefined,
    (statusSession, session) => {
      // return: isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
      console.log('Status Session: ', statusSession);
      // create session wss return "serverClose" case server for close
      console.log('Session name: ', session);
    },
    undefined
  )
  .then((client) => start(client))
  .catch((error) => console.log(error));
```

#### Exporting QR Code

By default, QR code will appear on the terminal. If you need to pass the QR
somewhere else heres how:

```javascript
const fs = require('fs');
const venom = require('venom-bot');

venom
  .create(
    'sessionName',
    (base64Qr, asciiQR) => {
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
  .then((client) => start(client))
  .catch((error) => console.log(error));
```

### Basic Functions (usage)

Not every available function will be listed, for further look, every function
available can be found in [here](/src/api/layers) and
[here](/src/lib/wapi/functions)

#### Chatting

> Here, `chatId` could be `<phoneNumber>@c.us` or `<phoneNumber>-<groupId>@g.us`

##### sendContactVcard

Send contact

```javascript
await client
  .sendContactVcard('000000000000@c.us', '111111111111@c.us', 'Name of contact')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });
```

##### sendContactVcardList

Send a list of contact cards

```javascript
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
```

##### sendText

Send basic text

```javascript
await client
  .sendText('000000000000@c.us', '👋 Hello from venom!')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });
```

##### sendLocation

Send location

```javascript
await client
  .sendLocation('000000000000@c.us', '-13.6561589', '-69.7309264', 'Brasil')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });
```

##### sendLinkPreview

Automatically sends a link with the auto generated link preview. You can also add a custom message to be added.

```javascript
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
```

##### sendImage

Send an image (you can also upload an image using a valid HTTP protocol)

```javascript
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
```

##### sendFile

Send a file (venom will take care of mime types, just need the path).\
You can also upload an image using a valid HTTP protocol

```javascript
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
```

##### sendFileFromBase64

Sends a file.

> base64 parameter should have mime type already defined

```javascript
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
```

##### sendImageAsStickerGif

Generates a sticker from the provided animated gif image and sends it (Send an image as animated sticker)\
Image path imageBase64 A valid gif and webp image will be required. You can also send via http/https (http://www.website.com/img.gif)

```javascript
await client
  .sendImageAsStickerGif('000000000000@c.us', './image.gif')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });
```

##### sendImageAsSticker

Generates a sticker from given image and sends it (Send Image As Sticker)\
image path imageBase64 A valid png, jpg and webp image will be required. You can also send via http/https (http://www.website.com/img.jpg)

```javascript
await client
  .sendImageAsSticker('000000000000@c.us', './image.jpg')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });
```

##### sendMentioned

Send `@tagged` message

```javascript
await client.sendMentioned(
  '000000000000@c.us',
  'Hello @5218113130740 and @5218243160777!',
  ['5218113130740', '5218243160777']
);
```

##### reply

Reply to a message

```javascript
await client.reply(
  '000000000000@c.us',
  'This is a reply!',
  message.id.toString()
);
```

##### reply with mention

Reply to a message with mention

```javascript
await client.reply(
  '000000000000@c.us',
  'Hello @5218113130740 and @5218243160777! This is a reply with mention!',
  message.id.toString(),
  ['5218113130740', '5218243160777']
);
```

##### sendMessageOptions

Send a message with options

```javascript
await client
    .sendMessageOptions(
      '000000000000@c.us',
      'This is a reply!',
       {
          quotedMessageId: reply,
        }
    )
    .then((result) => {
        console.log(result);
    })
    .catch((e) => {
      console.log(e);
    });

```

##### sendVideoAsGif

Send a gif

```javascript
await client.sendVideoAsGif(
  '000000000000@c.us',
  'path/to/video.mp4',
  'video.gif',
  'Gif image file'
);
```

##### forwardMessages

Forwards messages

```javascript
await client.forwardMessages(
  '000000000000@c.us',
  [message.id.toString()],
  true
);
```

##### sendSeen

Send seen ✔️✔️

```javascript
await client.sendSeen('000000000000@c.us');
```

##### startTyping

Start typing...

```javascript
await client.startTyping('000000000000@c.us');
```

##### stopTyping

Stop typing

```javascript
await client.stopTyping('000000000000@c.us');
```

##### setChatState

Set chat state (0: Typing, 1: Recording, 2: Paused)

```javascript
await client.setChatState('000000000000@c.us', 0 | 1 | 2);
```
