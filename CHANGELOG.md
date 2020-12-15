## [2.2.1](https://github.com/orkestral/venom/compare/v2.2.0...v2.2.1) (2020-12-15)

### Bug Fixes

- Fixed sendSeen call ([e2c0026](https://github.com/orkestral/venom/commit/e2c0026763f6255c903095c02c484d763b8de65d))

# [2.2.0](https://github.com/orkestral/venom/compare/v2.1.2...v2.2.0) (2020-12-15)

### Bug Fixes

- Fixed getMessageById from non loaded chat ([600ace1](https://github.com/orkestral/venom/commit/600ace18eb87807d07f813e06e6758dba2f79ad1))
- Fixed group functions (close [#416](https://github.com/orkestral/venom/issues/416)) ([e595f94](https://github.com/orkestral/venom/commit/e595f94a0768af41e2a89e6fbabe058deb2af637))
- Fixed undefined from sendLocation and sendContactVcard (close [#410](https://github.com/orkestral/venom/issues/410)) ([b46fc39](https://github.com/orkestral/venom/commit/b46fc39133f44e60b5833211b2eb700e6662a5e1))
- Improved script injection ([ba3b109](https://github.com/orkestral/venom/commit/ba3b109820c4dce62d02568b88b6174c5f9ea3b3))

### Features

- Added onInterfaceChange listener ([61e5fdf](https://github.com/orkestral/venom/commit/61e5fdfa43256b1eb4b91a1928fdf3ed6dfbf544))
- Added option to create from object ([6e9d557](https://github.com/orkestral/venom/commit/6e9d55757a76e969399e27f4a1798192e8663397))
- Improved logger using winston package ([dffb38c](https://github.com/orkestral/venom/commit/dffb38cc8330cec53aa70f66cff1b105e9c027d1))

## [2.1.2](https://github.com/orkestral/venom/compare/v2.1.1...v2.1.2) (2020-12-04)

### Bug Fixes

- Added error throw for sendSticker ([cdd43ef](https://github.com/orkestral/venom/commit/cdd43ef6b3a031a3820b92aba79f5f6da5c94d5c))

### Features

- Added downloadMedia method (close [#383](https://github.com/orkestral/venom/issues/383), close [#378](https://github.com/orkestral/venom/issues/378)) ([f3e3906](https://github.com/orkestral/venom/commit/f3e3906836c0b9458a8244995c7c32292eacb065))

## [2.1.1](https://github.com/orkestral/venom/compare/v2.1.0...v2.1.1) (2020-12-02)

### Bug Fixes

- Fixed ninth digit problem (close [#370](https://github.com/orkestral/venom/issues/370)) ([ee970dd](https://github.com/orkestral/venom/commit/ee970ddb38ed0a5c048cff093dc337f109de34fb))
- Fixed ninth digit problem for groups (close [#372](https://github.com/orkestral/venom/issues/372)) ([7017dea](https://github.com/orkestral/venom/commit/7017dea8ab66298a267e7cdcf9aa810b82d7313a))
- Fixed ninth digit problem group operation (close [#374](https://github.com/orkestral/venom/issues/374)) ([df477e7](https://github.com/orkestral/venom/commit/df477e7973b620c1f80850d95842ae09936985bc))

# [2.1.0](https://github.com/orkestral/venom/compare/v2.0.27...v2.1.0) (2020-12-01)

### Bug Fixes

- Fixed CPU and memory usage ([b439abf](https://github.com/orkestral/venom/commit/b439abf53372fbe935bbedba8e6967cd78194693))

### Features

- Added logout method ([6950e40](https://github.com/orkestral/venom/commit/6950e4053ab80976064ee353f011cb5eb5be8426))
- Improved client, allow page refresh, better event listener ([fec67ca](https://github.com/orkestral/venom/commit/fec67caada07443a26c6b9bf66a976a16285df48))
- Improved the quality of wapi.js ([5ea77e3](https://github.com/orkestral/venom/commit/5ea77e3d269edc959d7730c7fa59b60b7d68a486))
- new example ([ea45fa5](https://github.com/orkestral/venom/commit/ea45fa50b720e96a4f7389b093ca0013e816dc7e))

## [2.0.27](https://github.com/orkestral/venom/compare/v2.0.26...v2.0.27) (2020-11-28)

### Bug Fixes

- Fixed error log for send files from local ([e4a6f06](https://github.com/orkestral/venom/commit/e4a6f069d3a8c1d8f1d3478fb3cd43b3c50a0aa7))

## [2.0.26](https://github.com/orkestral/venom/compare/v2.0.25...v2.0.26) (2020-11-25)

### Features

- Improved QRCode reader and added url code in callback ([0bdcc05](https://github.com/orkestral/venom/commit/0bdcc056508396ebefd7c6b91a44258602f00250))

## [2.0.25](https://github.com/orkestral/venom/compare/v2.0.24...v2.0.25) (2020-11-23)

### Bug Fixes

- Fixed download GIF image format ([78def2e](https://github.com/orkestral/venom/commit/78def2e1e55de40f63c7b2374f4285676d10424f))

## [2.0.24](https://github.com/orkestral/venom/compare/v2.0.23...v2.0.24) (2020-11-23)

### Bug Fixes

- Fixed download JPEG image format ([c88590f](https://github.com/orkestral/venom/commit/c88590f16c1976a60372a3af8dd1d4868a9ef1a8))

## [2.0.23](https://github.com/orkestral/venom/compare/v2.0.22...v2.0.23) (2020-11-21)

### Bug Fixes

- Added timeout for browserWS connection ([3b31c1f](https://github.com/orkestral/venom/commit/3b31c1f2412559d87ee4097d7ab4cd027445b5e6))
- Added timeout for browserWS connection ([1b28832](https://github.com/orkestral/venom/commit/1b288322d5e4a4ef7d52402be28d638aaf478d6a))
- Fixed autoclose is holding promise ([35a5898](https://github.com/orkestral/venom/commit/35a58989d6314a82dfc3a0c4f8bb81c58b98808a))
- Fixed return of sendText for new non contact ([4147e75](https://github.com/orkestral/venom/commit/4147e75b53ca22fecd855356dbaaf80dd3710f94))
- Fixed send content from URL ([325538b](https://github.com/orkestral/venom/commit/325538b80f45a2792ff1119841bf03849723a416))
- Fixed sendImageAsStickerGif for big images (close [#251](https://github.com/orkestral/venom/issues/251)) ([48b1268](https://github.com/orkestral/venom/commit/48b12683bf8b249bf1088d2a8dd8071140109014))

## [2.0.22](https://github.com/orkestral/venom/compare/v2.0.21...v2.0.22) (2020-11-19)

### Bug Fixes

- Fixed QRCode reader ([247fe17](https://github.com/orkestral/venom/commit/247fe178aec25c504afd6142464ea7420a489a7c))

## [2.0.21](https://github.com/orkestral/venom/compare/v2.0.20...v2.0.21) (2020-11-17)

### Bug Fixes

- Added lint and fixed javascript issues (close [#326](https://github.com/orkestral/venom/issues/326)) ([#328](https://github.com/orkestral/venom/issues/328)) ([31509d6](https://github.com/orkestral/venom/commit/31509d64de7ce228653f8b521986c4c29ff1ac80))

### Features

- Added method getLastSeen (close [#303](https://github.com/orkestral/venom/issues/303)) ([#330](https://github.com/orkestral/venom/issues/330)) ([430e2c3](https://github.com/orkestral/venom/commit/430e2c32d398240991b50c8984a508dc0a2952a9))

## [2.0.20](https://github.com/orkestral/venom/compare/v2.0.19...v2.0.20) (2020-11-16)

### Bug Fixes

- Fixed error on replying a invalid message (close [#320](https://github.com/orkestral/venom/issues/320)) ([917db7a](https://github.com/orkestral/venom/commit/917db7a8db960d914d207a967bdd3603dbf040e0))

### Features

- Send image from base64 ([#319](https://github.com/orkestral/venom/issues/319)) ([9085132](https://github.com/orkestral/venom/commit/90851322e9cedddb16299dbc93c675af084033c0))

## [2.0.19](https://github.com/orkestral/venom/compare/v2.0.18...v2.0.19) (2020-11-14)

### Bug Fixes

- Add StickerGif compatibility with Webp format ([#278](https://github.com/orkestral/venom/issues/278)) ([9104a9b](https://github.com/orkestral/venom/commit/9104a9b4713b1c5a194a8f9f955240318a5d4b2d)), closes [/github.com/orkestral/venom/issues/277#issuecomment-719068476](https://github.com//github.com/orkestral/venom/issues/277/issues/issuecomment-719068476)
- git ignore ([2c1fc1d](https://github.com/orkestral/venom/commit/2c1fc1d108bb907f83fe6ab1d00439c0ad6ce0ae))
- remove package-lock.json ([2c2e134](https://github.com/orkestral/venom/commit/2c2e134f40d97b6583797aa0c6f20b728e87b713))
- sendSticker 'modelClass' of undefined ([9166c68](https://github.com/orkestral/venom/commit/9166c6821e1c91c446478e4584c9ef0304f081f1))
- **293:** group property 'find' of undefined ([a661e1c](https://github.com/orkestral/venom/commit/a661e1c0d3505469af1ce8f2af198ad016b7ba85))

### Features

- fix some things and create space for examples ([ed964d8](https://github.com/orkestral/venom/commit/ed964d8829d26ae2740442c27bf7ab333d28b8ac))
- **conteex:** fix sticker ([f8feaae](https://github.com/orkestral/venom/commit/f8feaae74b71328ac0ab541cdea15c939a4308a2))
- **context:** file dist.zip ([3134cdf](https://github.com/orkestral/venom/commit/3134cdfeb24422874b1a996b176183c93b4d4cba))
- **context:** readme whatsapp ([6682e01](https://github.com/orkestral/venom/commit/6682e01779f13f967fc16544763fb02f88c4ba57))
- dist teste ([68d63de](https://github.com/orkestral/venom/commit/68d63ded50b98e7968dff32320c8c1f999229ef1))
- new function and fixed some things ([#295](https://github.com/orkestral/venom/issues/295)) ([f1cea5d](https://github.com/orkestral/venom/commit/f1cea5d5ec1e3610087363c5d4df7545033f60d9))
- new function and some corrections ([a4be96f](https://github.com/orkestral/venom/commit/a4be96fd589ca40a0d8c85720bda36515caea59c))
- new function to change group permission ([9f4eeef](https://github.com/orkestral/venom/commit/9f4eeef3bfd8fffe61897d0c9051e1aa4bbe8241))

## [2.0.18](https://github.com/orkestral/venom/compare/v2.0.17...v2.0.18) (2020-10-22)

### Bug Fixes

- change deprecated function puppeteer ([eff5660](https://github.com/orkestral/venom/commit/eff5660edd031f46b6d4f6fdc68314586ec017ff))

## [2.0.17](https://github.com/orkestral/venom/compare/v2.0.16...v2.0.17) (2020-10-22)

### Bug Fixes

- remove function stream and fix userAgente ([7fe0701](https://github.com/orkestral/venom/commit/7fe0701f71da1d3e4b8b85152120bf547b691fbc))

## [2.0.16](https://github.com/orkestral/venom/compare/v2.0.15...v2.0.16) (2020-10-20)

### Bug Fixes

- **#222:** add option to inject options into puppeteer ([bbd907c](https://github.com/orkestral/venom/commit/bbd907c808a1990786ad7d48033bcad35ee48a84)), closes [#222](https://github.com/orkestral/venom/issues/222)

### Features

- **context:** delete token after disconnecting by phone and others ([e88fbd0](https://github.com/orkestral/venom/commit/e88fbd07b1cbd2d4f800366cd1a075db45771028))
- **context:** list mute chats and add mute chat ([0d37634](https://github.com/orkestral/venom/commit/0d3763498543f876e7c42661933e31a822d1e048))
- add new function to detect incoming call ([e6e2b7c](https://github.com/orkestral/venom/commit/e6e2b7c573383338954233757b3bd00c4aabc9a5))

## [2.0.15](https://github.com/orkestral/venom/compare/v2.0.14...v2.0.15) (2020-10-16)

### Bug Fixes

- fix function useHere() ([dd0564e](https://github.com/orkestral/venom/commit/dd0564e9fe975a3f61a9779053f3b81ab5b771a5))
- Update dependabot.yml ([472b407](https://github.com/orkestral/venom/commit/472b4070cfcdbe1f169aa18533d389d6e3346cd0))
- Update dependabot.yml ([a63d969](https://github.com/orkestral/venom/commit/a63d969e6d41cc79eb85b16c28abd89b3c22842c))
- Update dependabot.yml ([b41867f](https://github.com/orkestral/venom/commit/b41867f9ded889d74a91b208a355f10778b5538c))
- Update dependabot.yml ([c3f996f](https://github.com/orkestral/venom/commit/c3f996f6b8e99c3cd9b5558cca9a5dc05c005977))

### Features

- Create codeql-analysis workflow ([f35d3c1](https://github.com/orkestral/venom/commit/f35d3c151e2e85004ae1188ca8cdc803e2c52d69))
- Create dependabot ([2b59f52](https://github.com/orkestral/venom/commit/2b59f527a21efda62b1bfa7163828ff80f6a9ba4))
- create new function to detect disconnect ([1d70c9c](https://github.com/orkestral/venom/commit/1d70c9cc9a069a2b079e0ed40ee0488f84e3f27b))

## [2.0.14](https://github.com/orkestral/venom/compare/v2.0.11...v2.0.14) (2020-10-14)

### Bug Fixes

- change package ([9770cb6](https://github.com/orkestral/venom/commit/9770cb6d178877661531fe42e44070c51d64353c))

### Features

- **context:** client desconnected mobile ([0fafa3c](https://github.com/orkestral/venom/commit/0fafa3c3dbb71e2e7008eab1c69712b292d9f103))
- **context:** fix and add functions ([9222837](https://github.com/orkestral/venom/commit/9222837b7b8f5b328783b7077e7756155fbbdf01))
- **context:** return browserClose after logging in ([fed693c](https://github.com/orkestral/venom/commit/fed693c0229c7fe293ec45c13a82078ea3386f78))
- **context:** Treatment of the puppeteer.connect() function ([0dbebee](https://github.com/orkestral/venom/commit/0dbebeefeaaeeeb0e6327a876af18fd9691f9525))

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
