import * as boxen from 'boxen';

import * as chalk from 'chalk';

const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

export const BRAND = process.env.NAME;

import latestVersion from 'latest-version';

import { yo } from 'yoo-hoo';

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
  console.log('\n\n');
  yo(BRAND, { color: 'rainbow' });
  console.log('\n\n');
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
  await latestVersion('venom-pro')
    .then((latest) => {
      if (!upToDate(version, latest)) {
        logger.info('There is a new version available');
        logUpdateAvailable(version, latest);
      }
    })
    .catch(() => {
      logger.warn('Failed to check updates');
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
      `${chalk.bold('\>')} ${chalk.blueBright('npm update venom-pro')}`;

  logger.info(boxen(newVersionLog, { padding: 1 }));
  logger.info(
    `For more info visit: ${chalk.underline(
      'https://github.com/orkestral/venom/blob/master/Update.md'
    )}\n`
  );
}
