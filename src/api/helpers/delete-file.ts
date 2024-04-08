import path from 'path'
import { existsSync, unlink } from 'fs'
import { logger } from '../../utils/logger'

export async function deleteFiles(mergedOptions: any, Session: String) {
  try {
    logger.debug(`[deleteFiles-${Session}] removing file: ${Session}.data.json`)

    const pathTokens: string = path.join(
      path.resolve(
        process.cwd() + mergedOptions.mkdirFolderToken,
        mergedOptions.folderNameToken
      ),
      `${Session}.data.json`
    )
    if (existsSync(pathTokens)) {
      unlink(pathTokens, (err) => {
        if (err) {
          logger.error(
            `[deleteFiles-${Session}] failed to remove file: ${pathTokens}`
          )
          return
        }

        logger.debug(`[deleteFiles-${Session}] Removed file: ${pathTokens}`)
      })
    } else {
      logger.debug(`[deleteFiles-${Session}] Files not found: ${pathTokens}`)
    }
  } catch (error) {
    logger.error(
      `[deleteFiles-${Session}] failed to remove file: ${JSON.stringify(error)}`
    )
  }
}
