# Creating a Client

To start using `Venom Bot`, you need to create a file and call the {@link create} method.\
That method returns an `Promise` of {@link Whatsapp}.

```javascript
// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

venom
  .create()
  .then((client) => start(client))
  .catch((error) => console.log(error));
```

## Multi sessions

If you want to start more than one session, for example,
in case you have different departments in your project,
then you had to specify it in your code like in that example:

```javascript
// Init sales whatsapp bot
venom.create('sales').then((client) => startClient(client));

// Init support whatsapp bot
venom.create('support').then((client) => startSupport(client));
```

## Passing options on create

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

### Callback Status Session

Gets the return if the session is `isLogged` or `notLogged` or `browserClose`
or `qrReadSuccess` or `qrReadFail` or `autocloseCalled` or `desconnectedMobile`
or `deleteToken` or `Create session wss return "serverClose" case server for close`

| Status               | Condition                                                                                                                                                      |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
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

### Exporting QR Code

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
