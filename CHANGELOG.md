## [2.0.12]

- fix is onAck
- fix create more than one function: onMessage, onAnyMessage, onStateChange and onAck
- new option createPathFileToken
- new option in create browserSessionToken
- new option catchQR: attempt
- new function getSessionTokenBrowser

## [2.0.11](https://github.com/orkestral/venom/compare/v2.0.10...v2.0.11) (2020-10-07)

## [2.0.10](https://github.com/orkestral/venom/compare/v2.0.9...v2.0.10) (2020-10-06)

## [2.0.9](https://github.com/orkestral/venom/compare/v2.0.8...v2.0.9) (2020-10-06)

### Bug Fixes

- change chromium args ([1a18c5d](https://github.com/orkestral/venom/commit/1a18c5dbfaefe25de543db6ee179ffd8a02f20ad))
- change user agent ([baf9598](https://github.com/orkestral/venom/commit/baf9598e876245c8f51f8d3791727af61eab3979))
- correct link update ([599c562](https://github.com/orkestral/venom/commit/599c5625be97b07f5857683dea3cbc77f5ea35cc))
- name chromium ([25c1a3d](https://github.com/orkestral/venom/commit/25c1a3d1aef646ae4a93026e7880274c6b56988e))

### Features

- new option to connect browserWSEndpoint ([2343e1a](https://github.com/orkestral/venom/commit/2343e1a39059dced4a13dc6b41fc4055ac55ddcc))
- new option to connect with external browser ([2a62bb9](https://github.com/orkestral/venom/commit/2a62bb9d254d6651e5040d84128043d696d6694d))

## [2.0.7 | 2.0.8](https://github.com/orkestral/venom/compare/v2.0.6...v2.0.8) (2020-09-29)

- Updating packages
- Improved message download
- Message error when try descrypt

## [2.0.6](https://github.com/orkestral/venom/compare/v2.0.4...v2.0.6) (2020-09-28)

- Fixed return type of create function
- Fix initialization with autoclose

## [2.0.4 | 2.0.5](https://github.com/orkestral/venom/compare/v2.0.3...v2.0.4) (2020-09-22)

- Change ascii welcome venom
- Update user agent
- Fix is connected

## [2.0.2 | 2.0.3](https://github.com/orkestral/venom/compare/a6ac61cd31c759dc75b1bfac3c6ecee645f54ee5...v2.0.3) (2020-09-21)

- add crete config folderNameToken, mkdirFolderToken
- fix package.json rxjs
- add option to disable message terminal Welcome Venom
- fix function to send by group id
- fix bug sendImageAsStickerGif, sendImageAsSticker
- return to chatid to object route treatment

## 2.0.1 (2020-09-14)

- fix bug initialization
- add checkNumberStatus, sendContactVcardList
- correction qrcode in terminal, sendContactVcard, setProfilePic, sendLocation
- add parameter in Callback Status Session: browserClose || qrReadSuccess \* || qrReadFail
- remove refreshQR and sendMessageToId

## 1.1.4 (2020-07-26)

- fix bug

## 1.1.2 (2020-07-24)

- fix bug autoclose

## 1.1.1 (2020-07-24)

- New functions

## 1.0.9 (2020-06-30)

- remove fix file mime type discovery

## 1.0.8 (2020-06-29)

- fix reply (with mention)
- add function autoClose
- add function joingroup
- add function getgroupinfofrominvitelink
- fix file mime type discovery

## 1.0.7 (2020-06-20)

- add setProfilePic
- Fix bug getAllNewMessages

## 1.0.6 (2020-06-19)

- Fix bug not exist folder dist

## 1.0.5 (2020-06-19)

- Fix bug useHere

## 1.0.4 (2020-06-15)

- Fix bug performace

## 1.0.3 (2020-06-14)

- Fix bug performace

## 1.0.2 (2020-06-13)

\*Fix bug disabled spinners

## 1.0.1 (2020-06-13)

- Session for Token - for [HelioSilva](https://github.com/orkestral/venom/commits?author=HelioSilva)
- Spinners disabled options - for [CosmicSnow](https://github.com/orkestral/venom/commits?author=CosmicSnow)

## 1.0.0 (2020-06-06)

- First version
- Init readme
- Do not force rxjs
- Initial commit
- Fix CatchQR erro
- QR catching
- Add Status of Session
