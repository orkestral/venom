const venom = require('../../dist')

venom
  .create(
    'sessionName', //session
    null, //catchQR
    null, //callbackStatus
    null, //options
    null, //BrowserSessionToken
    (browser, waPage) => {
      // Show broser process ID
      console.log('Browser PID:', browser.process().pid)
      // Take screenshot before logged-in
      waPage.screenshot({ path: 'before-screenshot.png' })
    }
  )
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro)
  })

function start(client) {
  // Taks screenshot after logged-in
  client.waPage.screenshot({ path: 'after-screenshot.png' })
}
