require = require('esm')(module);
import latestVersion from 'latest-version';
import { upToDate } from '../utils/semver';
import boxen from 'boxen';
import chalk from 'chalk';
const { version } = require('../../package.json');

let updatesChecked = false;

export async function checkUpdates() {
  if (!updatesChecked) {
    updatesChecked = true;
    return await checkVenomVersion();
  }
}

async function checkVenomVersion() {
  try {
    const latest = await latestVersion('venom-bot');
    if (upToDate(version, latest)) {
      console.log(chalk.red("You're up to date 🎉🎉🎉"));
    } else {
      console.log('There is a new version available');
      logUpdateAvailable(version, latest);
    }
  } catch {
    console.log(
      'Unable to access: "https://www.npmjs.com", check your internet'
    );
    return false;
  }
}

function logUpdateAvailable(current, latest) {
  // prettier-ignore
  const newVersionLog =
      `There is a new version of ${chalk.bold(`venom`)} ${chalk.gray(current)} ➜  ${chalk.bold.green(latest)}\n` +
      `Update your package by running:\n\n` +
      `${chalk.bold('\>')} ${chalk.blueBright('npm update venom-bot')}`;
  console.log(boxen(newVersionLog, { padding: 1 }));
  console.log(
    `For more info visit: ${chalk.underline(
      'https://github.com/orkestral/venom/blob/master/Update.md'
    )}\n`
  );
}
