import path from 'path';
import { existsSync, unlink } from 'fs';
export async function deleteFiles(mergedOptions: any, Session: String) {
  try {
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
          console.error(`Not removed file: ${pathTokens}`);
        } else {
          console.info(`Removed file: ${pathTokens}`);
        }
      });
    } else {
      console.error(`Not Files: ${pathTokens}`);
    }
  } catch (e) {}
}
