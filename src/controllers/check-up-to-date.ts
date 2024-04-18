import npmCheckUpdates from 'npm-check-updates'
import { upToDate } from '../utils/semver'
import { logger } from '../utils/logger'

const { version } = require('../../package.json')

let updatesChecked = false

export async function checkUpdates() {
  if (!updatesChecked) {
    updatesChecked = true
    return await checkVenomVersion()
  }
}

async function checkVenomVersion() {
  try {
    const latest = await getLatestVersion('@redspark/whatsapp-bot')
    if (upToDate(version, latest)) {
      logger.info("You're up to date 🎉🎉🎉")
    } else {
      const newVersionLog =
        `There is a new version available: ${version} -> ${latest}\n` +
        `Update your package by running:\n\n` +
        `> npm update @redspark/whatsapp-bot`

      logger.warn(newVersionLog)
    }
  } catch (error) {
    logger.error(`fail to check venom version error: ${error.message}`)
    return false
  }
}

async function getLatestVersion(packageName: string) {
  const upgraded = await npmCheckUpdates({
    packageData: JSON.stringify({
      dependencies: { '@redspark/whatsapp-bot': '1.0.0' },
    }),
    silent: true,
    jsonUpgraded: true,
  })
  return upgraded[packageName]
}
