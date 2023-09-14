# Basic Functions (usage)

Not every available function will be listed, for further look, every function
available can be found in {@link Whatsapp}

## Summary

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
  - [setChatState](#setchatstate)

## Chatting

> Here, `chatId` could be `<phoneNumber>@c.us` or `<phoneNumber>-<groupId>@g.us`

### sendContactVcard

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

### sendContactVcardList

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

### sendText

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

### sendLocation

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

### sendLinkPreview

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

### sendImage

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

### sendFile

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

### sendFileFromBase64

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

### sendImageAsStickerGif

Generates a sticker from the provided animated gif image and sends it (Send an image as animated sticker)\
Image path imageBase64 A valid gif and webp image will be required. You can also send via http/https (<http://www.website.com/img.gif>)

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

### sendImageAsSticker

Generates a sticker from given image and sends it (Send Image As Sticker)\
image path imageBase64 A valid png, jpg and webp image will be required. You can also send via http/https (<http://www.website.com/img.jpg>)

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

### sendMentioned

Send `@tagged` message

```javascript
await client.sendMentioned(
  '000000000000@c.us',
  'Hello @5218113130740 and @5218243160777!',
  ['5218113130740', '5218243160777']
);
```

### reply

Reply to a message

```javascript
await client.reply(
  '000000000000@c.us',
  'This is a reply!',
  message.id.toString()
);
```

### reply with mention

Reply to a message with mention

```javascript
await client.reply(
  '000000000000@c.us',
  'Hello @5218113130740 and @5218243160777! This is a reply with mention!',
  message.id.toString(),
  ['5218113130740', '5218243160777']
);
```

### sendMessageOptions

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

### sendVideoAsGif

Send a gif

```javascript
await client.sendVideoAsGif(
  '000000000000@c.us',
  'path/to/video.mp4',
  'video.gif',
  'Gif image file'
);
```

### forwardMessages

Forwards messages

```javascript
await client.forwardMessages(
  '000000000000@c.us',
  [message.id.toString()],
  true
);
```

### sendSeen

Send seen ✔️✔️

```javascript
await client.sendSeen('000000000000@c.us');
```

### startTyping

Start typing...

```javascript
await client.startTyping('000000000000@c.us');
```

### setChatState

Set chat state (0: Typing, 1: Recording, 2: Paused)

```javascript
await client.setChatState('000000000000@c.us', 0 | 1 | 2);
```
