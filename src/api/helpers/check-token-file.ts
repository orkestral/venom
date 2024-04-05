const path = require('path')
import { existsSync } from 'fs'

export function checkFileJson(mergedOptions: any, Session: String) {
  const pathTokens: string = path.join(
    path.resolve(
      process.cwd() + mergedOptions.mkdirFolderToken,
      mergedOptions.folderNameToken
    ),
    `${Session}.data.json`
  )
  if (existsSync(pathTokens)) {
    return true
  } else {
    return false
  }
}
