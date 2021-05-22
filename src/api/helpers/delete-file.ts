import path = require('path');
import { existsSync, unlink } from 'fs';
import * as Spinnies from 'spinnies';
export async function deleteFiles(
  mergedOptions: any,
  Session: String,
  spinnies: Spinnies
) {
  spinnies.add(`removeFile`, { text: '....' });
  const pathTokens: string = path.join(
    path.resolve(
      process.cwd() + mergedOptions.mkdirFolderToken,
      mergedOptions.folderNameToken
    ),
    `${Session}.data.json`
  );
  if (existsSync(pathTokens)) {
    unlink(pathTokens, (err) => {
      if (err) {
        spinnies.fail(`removeFile`, {
          text: `Not removed file: ${pathTokens}`,
        });
      }
      spinnies.succeed(`removeFile`, {
        text: `Removed file: ${pathTokens}`,
      });
    });
  } else {
    spinnies.fail(`removeFile`, { text: `Not Files: ${pathTokens}` });
  }
}
