# Configuring the logger

`Venom Bot` use [winston](https://github.com/winstonjs/winston) package for log management.

`venom.defaultLogger` is a instance of `winston.createLogger`.

## Default Log level

The default log level is `info`

```javascript
// Supports ES6
// import * as venom from 'venom-bot';
const venom = require('venom-bot');

// Levels: 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'
// All logs: 'silly'
venom.defaultLogger.level = 'silly';

// If you want stop console logging
venom.defaultLogger.transports.forEach((t) => (t.silent = true));
```

## Using a custon logger

```javascript
// Supports ES6
// import * as venom from 'venom-bot';
// import * as winston from 'winston';
const venom = require('venom-bot');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

venom
  .create(
    'sessionName',
    undefined,
    undefined,
    {
      logger: logger
    }
  )
  .then((client) => {
    start(client);
  })
  .catch((erro) => {
    console.log(erro);
  });
```

## Log to file

By default, venom-bot use the Console transport for logging.

If you want to save the log to a file, you can configure
using the [winston transport](https://github.com/winstonjs/winston#transports)

```javascript
// Supports ES6
// import * as venom from 'venom-bot';
// import * as winston from 'winston';
const venom = require('venom-bot');
const winston = require('winston');

// Optional: Remove all default transports
venom.defaultLogger.clear(); // Remove all transports

// Create a file transport
const files = new winston.transports.File({ filename: 'combined.log' });
venom.defaultLogger.add(files); // Add file transport

// Optinal: create a custom console with error level
const console = new winston.transports.Console({ level: 'erro' });
venom.defaultLogger.add(console); // Add console transport

// Optinal: Remove the custom transport
venom.defaultLogger.remove(console); // Remove console transport
```
