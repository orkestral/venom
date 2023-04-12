const { create } = require('../dist');

(async () => {
  create({
    session: 'session-name', //name of session
    multidevice: true,
    headless: false,
    logQR: true,
    useChrome: true
  })
    .then((client) => start(client))
    .catch((erro) => {
      console.error(erro);
    });
  function start(client) { }

})();