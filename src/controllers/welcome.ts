import * as boxen from 'boxen';
import * as chalk from 'chalk';
import latestVersion from 'latest-version';
import { defaultLogger as logger } from '../utils/logger';
import { upToDate } from '../utils/semver';
const { version } = require('../../package.json');

// Global
let welcomeShown = false;
let updatesChecked = false;

export function welcomeScreen() {
  if (welcomeShown) {
    return;
  }
  welcomeShown = true;
  logger.info(`
     
    ▐█  ██  █░▐█▀▀▀░▐█     ▄█▀▀█▄ ▄█▀▀█▄ ▐██   ██▌ ▓█▀▀▀░
     █▌▐██▄▓█ ▐█▄▄▄ ▐█    ▐█      █▒  ▐█▄▐█▀▌ ▐▌█▌ ▓█▄▄▄
     ▐██ ▐██░ ▐█    ▐█    ▐█▄  ▄▀ █▌  ▐█ ▐█ █▓█ █▌ ██
      ▀▀  ▀▀  ▀▀▀▀▀░▐▀▀▀▀▀  ▀▀▀▀   ▀▀▀▀  ▐▀  ▀  ▀▀ ▀▀▀▀▀
                                   ▄
      ▄▄░          ▄ ▄▄▄▄▄▄▄▄▄▄▄▄▄ ██         ▄▄       ▄▄▄▄      ░
      ░██▄        ██ ███▀▀▀▀▀▀▀▀█▌ ███▌       ██▄  ▄▄█▀▀▀▀▀▀█▄   ▓█▄           ▄█░
       ░██▄     ░██▀ ███           ██▀██▄     ██▄ ▄█░        ▀█▄ ▓███▄      ░████░
         ██▌   ▄██░ ▄███▄▄▄▄       ██  ▓██▄   ██▄▐█           ▐█ ▓█▌▀██▄  ▄███░██░
          ██▌ ▄██░  ▀███▀▀▀▀       ██   ▐██▌  ██▄▐█           ▐█░▓█▌  ▀█████░  ██░
           ▓████     ███           ██     ▀██▄██▄ █▌          ██ ▓█▌    ▀█░    ██░
            ▀██      ███        █▌ ██       ▀███▄  ▀█▄     ▄▄█▀  ▓█▌           ██░
             ▀       ▀███████████▌ ██        ░██▄    ▀▀███▀▀░    ▀█▌           ▓█░
                                              ▀░                                   \n`);
}

export async function checkUpdates() {
  // Check for updates if needed
  if (!updatesChecked) {
    updatesChecked = true;
    await checkVenomVersion();
  }
}

/**
 * Checs for a new versoin of venom and logs
 */
async function checkVenomVersion() {
  logger.info('Checking for updates');
  await latestVersion('venom-bot').then((latest) => {
    if (upToDate(version, latest)) {
      logger.info("You're up to date");
    } else {
      logger.info('There is a new version available');
      logUpdateAvailable(version, latest);
    }
  });
}

/**
 * Logs a boxen of instructions to update
 * @param current
 * @param latest
 */
function logUpdateAvailable(current: string, latest: string) {
  // prettier-ignore
  const newVersionLog =
      `There is a new version of ${chalk.bold(`Venom`)} ${chalk.gray(current)} ➜  ${chalk.bold.green(latest)}\n` +
      `Update your package by running:\n\n` +
      `${chalk.bold('\>')} ${chalk.blueBright('npm update venom-bot')}`;

  logger.info(boxen(newVersionLog, { padding: 1 }));
  logger.info(
    `For more info visit: ${chalk.underline(
      'https://github.com/orkestral/venom/blob/master/Update.md'
    )}\n`
  );
}
