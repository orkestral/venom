# 🕷Venom Bot🕸

![enter image description here](https://s2.click/venom.jpg)

> Venom is a high-performance system developed with JavaScript to create a bot for WhatsApp, support for creating any interaction, such as customer service, media sending, sentence recognition based on artificial intelligence and all types of design architecture for WhatsApp.

## 🕷🕷 Functions Venom🕷🕷

|                                                            |     |
| ---------------------------------------------------------- | --- |
| Automatic QR Refresh                                       | ✔   |
| Send **text, image, video, audio and docs**                | ✔   |
| Get **contacts, chats, groups, group members, Block List** | ✔   |
| Send contacts                                              | ✔   |
| Send stickers                                              | ✔   |
| Send stickers GIF                                          | ✔   |
| Multiple Sessions                                          | ✔   |
| Forward Messages                                           | ✔   |
| Receive message                                            | ✔   |
| 📍 Send location!!                                         | ✔   |
| 🕸🕸 **and much more**                                       | ✔   |

## Installation

```bash
> npm i --save venom-bot
```

## Getting started

```javascript
// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

venom
  .create()
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

```javascript
const venom = require('venom-bot');

venom
  .create(
    'sessionName',
    (base64Qrimg, asciiQR) => {
      console.log('Terminal qrcode: ', asciiQR);
      console.log('base64 image string qrcode: ', base64Qrimgr);
    },
    (statusSession) => {
      console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail
    },
    {
      headless: true, // Headless chrome
      devtools: false, // Open devtools by default
      useChrome: true, // If false will use Chromium instance
      debug: false, // Opens a debug session
      logQR: true, // Logs QR automatically in terminal
      browserArgs: [''], // Parameters to be added into the chrome browser instance
      disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
      disableWelcome: true, // Will disable the welcoming message which appears in the beginning
      updates: true, // Logs info updates automatically in terminal
      autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
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

Gets the return if the session is `isLogged` or `notLogged` or `browserClose` or `qrReadSuccess` or `qrReadFail`

##### `isLogged: When the user is already logged in to the browser`.

##### `notLogged: When the user is not connected to the browser, it is necessary to scan the QR code through the cell phone in the option WharsApp Web`.

##### `browserClose: If the browser is closed this parameter and returned`.

##### `qrReadSuccess: if the user is not logged in, the QR code is passed on the terminal a callback is returned. After the correct reading by cell phone this parameter is returned`.

##### `qrReadFail: If the browser stops when the QR code scan is in progress, this parameter is returned`.

```javascript
const venom = require('venom-bot');
venom
  .create(
    'sessionName',
    undefined,
    (statusSession) => {
      console.log('Status Session: ', statusSession);
      //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail
    },
    undefined
  )
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
    (base64Qr, asciiQR) => {
      console.log(asciiQR); // Opcional to log the QR in the terminal
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
    await fs.writeFile(fileName, buffer, (err) => {
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

##### Here, `chatId` could be `<phoneNumber>@c.us` or `<phoneNumber>-<groupId>@c.us`

```javascript

// Send contact
await client.sendContactVcard("000000000000@c.us", "111111111111@c.us", "Name of contact").then((result)=>{
       console.log("Result: ", result); //return object success
   }).catch((erro)=>{
       console.error("Error when sending: ", erro); //return object error
 });

// Send a list of contact cards
await client.sendContactVcardList("000000000000@c.us",["111111111111@c.us", "222222222222@c.us"]).then((result)=>{
      console.log("Result: ", result); //return object success
  }).catch((erro)=>{
      console.error("Error when sending: ", erro); //return object error
});

// Send basic text
await client.sendText("000000000000@c.us", '👋 Hello from venom!').then((result)=>{
      console.log("Result: ", result); //return object success
  }).catch((erro)=>{
      console.error("Error when sending: ", erro); //return object error
});

// Send location
await client.sendLocation("000000000000@c.us", "-13.6561589", "-69.7309264", "Brasil").then((result)=>{
      console.log("Result: ", result); //return object success
  }).catch((erro)=>{
      console.error("Error when sending: ", erro); //return object error
});

//Automatically sends a link with the auto generated link preview. You can also add a custom message to be added.
await client.sendLinkPreview("000000000000@c.us", "https://www.youtube.com/watch?v=V1bFr2SWP1I", "Kamakawiwo ole").then((result)=>{
      console.log("Result: ", result); //return object success
  }).catch((erro)=>{
      console.error("Error when sending: ", erro); //return object error
});

// Send image (you can also upload an image using a valid HTTP protocol)
await client.sendImage("000000000000@c.us" 'path/to/img.jpg', 'image-name', 'Caption text').then((result)=>{
      console.log("Result: ", result); //return object success
  }).catch((erro)=>{
      console.error("Error when sending: ", erro); //return object error
});

// Send file (venom will take care of mime types, just need the path)
//you can also upload an image using a valid HTTP protocol
await client.sendFile("000000000000@c.us", 'path/to/file.pdf', 'file_name', 'See my file in pdf').then((result)=>{
      console.log("Result: ", result); //return object success
  }).catch((erro)=>{
      console.error("Error when sending: ", erro); //return object error
});

//Sends file
// base64 parameter should have mime type already defined
 await client.sendFileFromBase64("000000000000@c.us", base64PDF, 'file_name.pdf', 'See my file in pdf').then((result)=>{
      console.log("Result: ", result); //return object success
  }).catch((erro)=>{
      console.error("Error when sending: ", erro); //return object error
});

// Send @tagged message
await client.sendMentioned("000000000000@c.us", 'Hello @5218113130740 and @5218243160777!',['5218113130740','5218243160777']);

// Reply to a message
await client.reply("000000000000@c.us", 'This is a reply!', message.id.toString());

// Reply to a message with mention
await client.reply("000000000000@c.us", 'Hello @5218113130740 and @5218243160777! This is a reply with mention!', message.id.toString(), ['5218113130740', '5218243160777']);



// Send gif
await client.sendVideoAsGif( "000000000000@c.us",'path/to/video.mp4', 'video.gif', 'Gif image file');


// Forwards messages
await client.forwardMessages("000000000000@c.us", [message.id.toString()], true);

//Generates sticker from the provided animated gif image and sends it (Send image as animated sticker)
//image path imageBase64 A valid gif image is required. You can also send via http/https (http://www.website.com/img.gif)
await client.sendImageAsStickerGif("000000000000@c.us", './image.gif');

//Generates sticker from given image and sends it (Send Image As Sticker)
// image path imageBase64 A valid png, jpg and webp image is required. You can also send via http/https (http://www.website.com/img.jpg)
await client.sendImageAsSticker("000000000000@c.us", './image.jpg');

// Send location


// Send seen ✔️✔️
await client.sendSeen("000000000000@c.us");

// Start typing...
await client.startTyping("000000000000@c.us");

// Stop typing
await client.stopTyping("000000000000@c.us");

// Set chat state (0: Typing, 1: Recording, 2: Paused)
await client.setChatState("000000000000@c.us", 0 | 1 | 2);
```

## Retrieving Data

```javascript
// Calls your list of blocked contacts (returns an array)
const getBlockList = await client.getBlockList();

// Retrieve contacts
const contacts = await client.getAllContacts();

// Retrieve messages in chat
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
const user = await client.getNumberProfile('000000000000@c.us');

// Retrieve all unread message
const messages = await client.getAllUnreadMessages();

// Retrieve all chats
const chats = await client.getAllChats();

// Retrieve all groups
const chats = await client.getAllGroups();

// Retrieve profile fic (as url)
const url = await client.getProfilePicFromServer('000000000000@c.us');

// Retrieve chat/conversation
const chat = await client.getChat('000000000000@c.us');

// Check if the number exists
const chat = await client.checkNumberStatus('000000000000@c.us');
```

## Group Functions

```javascript
// groupId or chatId: leaveGroup 52123123-323235@g.us

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
  '222222222222@c.us',
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
```

## Device Functions

```javascript
//Delete the Service Worker
await client.killServiceWorker();

//Load the service again
await client.restartService();

// Get device info
await client.getHostDevice();

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
// Listen to messages
client.onMessage(message => {
  ...
})

// Listen to state changes
client.onStateChange(state => {
  ...
});

// Listen to ack's
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
// Pin chat and Unpin chat messages with true or false
await client
  .pinChat(chatId, true | false)
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });

//Change the theme
//string types "dark" or "light"
await client.setTheme('dark');

//Receive the current theme
//returns string light or dark
await client.getTheme();

// Delete chat
await client.deleteChat('000000000000@c.us');

// Clear chat messages
await client.clearChat('000000000000@c.us');

// Archive and unarchive chat messages with true or false
await client.archiveChat(chatId, true);

// Delete message (last parameter: delete only locally)
await client.deleteMessage('000000000000@c.us', message.id.toString(), false);

// Mark chat as not seen (returns true if it works)
await client.markUnseenMessage('000000000000@c.us');

//blocks a user (returns true if it works)
await client.blockContact('000000000000@c.us');

//unlocks contacts (returns true if it works)
await client.unblockContact('000000000000@c.us');

// Retrieve a number profile / check if contact is a valid whatsapp number
const profile = await client.getNumberProfile('000000000000@c.us');
```

## Misc

There are some tricks for a better usage of venom.

#### Keep session alive:

```javascript
// In case of being logged out of whatsapp web
// Force it to keep the current session
// State change
client.onStateChange((state) => {
  console.log(state);
  const conflits = [
    venom.SocketState.CONFLICT,
    venom.SocketState.UNPAIRED,
    venom.SocketState.UNLAUNCHED,
  ];
  if (conflits.includes(state)) {
    client.useHere();
  }
});
```

#### Multiple sessions

If you need to run multiple sessions at once just pass a session name to
`create()` method, not use hyphen for name of sessions.

```javascript
async () => {
  const marketingClient = await venom.create('marketing');
  const salesClient = await venom.create('sales');
  const supportClient = await venom.create('support');
};
```

#### Closing (saving) sessions

Close the session properly to ensure the session is saved for the next time you
log in (So it wont ask for QR scan again). So instead of CTRL+C,

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

The auto close is enabled by default and the timeout is setted to 60 sec.
Receives the time in milliseconds to countdown until paired.

##### Important with `autoClose` enabled the "refreshQR" parameter is changed to 1000 (1 sec.)!

Use "autoClose: false" to disable auto closing.

### Debugging

## Development

Building venom is really simple altough it contians 3 main projects inside

1. Wapi project

```bash
> npm run build:wapi
```

2. Middleeware

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
