const { create } = require('../dist');

(async () => {
  create({
    session: 'session-name', //name of session
    headless: false
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {

}

})();