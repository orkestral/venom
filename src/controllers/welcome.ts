import * as boxen from 'boxen';

import * as chalk from 'chalk';

const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

export const BRAND = process.env.NAME;

const latestLib = require('latest-lib');

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
    await checkVenomVersion();
  }
}

/**
 * Checs for a new versoin of venom and logs
 */
async function checkVenomVersion() {
  logger.info('Checking for updates');
  await latestLib('venom-bot')
    .then((latest) => {
      logger.info(latest.version);
      logger.info(version);
      if (!upToDate(version, latest.version)) {
        logger.info('There is a new version available');
        logUpdateAvailable(version, latest.version);
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
