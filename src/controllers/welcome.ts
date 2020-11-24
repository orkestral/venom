import * as boxen from 'boxen';
import * as chalk from 'chalk';
import latestVersion from 'latest-version';
import * as Spinnies from 'spinnies';
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
  console.log(`
     
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

export async function checkUpdates(spinnies: Spinnies) {
  // Check for updates if needed
  if (!updatesChecked) {
    spinnies.add('venom-version-spinner', {
      text: 'Checking for updates',
    });
    await checkVenomVersion(spinnies);
    updatesChecked = true;
  }
}

/**
 * Checs for a new versoin of venom and logs
 */
async function checkVenomVersion(spinnies: Spinnies) {
  spinnies.update('venom-version-spinner', { text: 'Checking for updates...' });
  await latestVersion('venom-bot').then((latest) => {
    if (upToDate(version, latest)) {
      spinnies.succeed('venom-version-spinner', { text: "You're up to date" });
    } else {
      spinnies.succeed('venom-version-spinner', {
        text: 'There is a new version available',
      });
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

  console.log(boxen(newVersionLog, { padding: 1 }));
  console.log(
    `For more info visit: ${chalk.underline(
      'https://github.com/orkestral/venom/blob/master/Update.md'
    )}\n`
  );
}
