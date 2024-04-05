import { upToDate } from '../utils/semver'
import boxen from 'boxen'
import chalk from 'chalk'
const { version } = require('../../package.json')
import npmCheckUpdates from 'npm-check-updates'

let updatesChecked = false

export async function checkUpdates() {
  if (!updatesChecked) {
    updatesChecked = true
    return await checkVenomVersion()
  }
}

async function checkVenomVersion() {
  try {
    const latest = await getLatestVersion('venom-bot')
    if (upToDate(version, latest)) {
      console.log(chalk.red("You're up to date 🎉🎉🎉"))
    } else {
      console.log('There is a new version available')
      logUpdateAvailable(version, latest)
    }
  } catch (e) {
    console.log(e)
    console.log(
      'Unable to access: "https://www.npmjs.com", check your internet'
    )
    return false
  }
}

async function getLatestVersion(packageName: string) {
  const upgraded = await npmCheckUpdates({
    packageData: JSON.stringify({
      dependencies: { 'venom-bot': '1.0.0' },
    }),
    silent: true,
    jsonUpgraded: true,
  })
  return upgraded[packageName]
}

function logUpdateAvailable(current: string, latest: string) {
  // prettier-ignore
  const newVersionLog =
      `There is a new version of ${chalk.bold(`venom`)} ${chalk.gray(current)} ➜  ${chalk.bold.green(latest)}\n` +
      `Update your package by running:\n\n` +
      `${chalk.bold('>')} ${chalk.blueBright('npm update venom-bot')}`;
  console.log(boxen(newVersionLog, { padding: 1 }))
  console.log(
    `For more info visit: ${chalk.underline(
      'https://github.com/orkestral/venom/blob/master/Update.md'
    )}\n`
  )
}
