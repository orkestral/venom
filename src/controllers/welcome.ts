import * as boxen from 'boxen';

import * as chalk from 'chalk';

import latestVersion from 'latest-version';

import * as Spinnies from 'spinnies';

import { yo } from 'yoo-hoo';

import { upToDate } from '../utils/semver';

const { version } = require('../../package.json');

// Global
let welcomeShown = false;
let updatesChecked = false;

export default function Welcome(): void {
  if (welcomeShown) {
    return;
  }
  WelcomeStart();
  yo('VENOM', { color: 'rainbow' });
  console.log('\n\n');

  function WelcomeStart() {
    welcomeShown = true;
  }
}

export async function checkUpdates(spinnies: Spinnies): Promise<boolean> {
  // Check for updates if needed
  if (!updatesChecked) {
    UpdateObservable();
    spinnies.add('venom-version-spinner', {
      text: 'Checking for updates',
    });
    return await checkVenomVersion(spinnies);
  }

  function UpdateObservable() {
    updatesChecked = true;
  }
}

/**
 * Checs for a new versoin of venom and logs
 */
async function checkVenomVersion(spinnies: Spinnies): Promise<boolean> {
  spinnies.update('venom-version-spinner', { text: 'Checking for updates...' });
  try {
    await latestVersion('venom-bot').then((latest): void => {
      if (upToDate(version, latest)) {
        spinnies.succeed('venom-version-spinner', {
          text: "You're up to date",
        });
      } else {
        spinnies.succeed('venom-version-spinner', {
          text: 'There is a new version available',
        });
        logUpdateAvailable({ current: version, latest });
      }
    });
  } catch {
    spinnies.fail('venom-version-spinner', {
      text: 'Unable to access: "https://www.npmjs.com", check your internet',
    });
    return false;
  }
}

/**
 * Logs a boxen of instructions to update
 * @param current
 * @param latest
 */
function logUpdateAvailable({
  current,
  latest,
}: {
  current: string;
  latest: string;
}): void {
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
