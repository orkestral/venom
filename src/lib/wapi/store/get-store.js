const { storeObjects } = require('./store-objects')

export async function getStore(modules) {
  let foundCount = 0
  const neededObjects = storeObjects
  for (const idx in modules) {
    if (typeof modules[idx] === 'object' && modules[idx] !== null) {
      neededObjects.forEach((needObj) => {
        if (!needObj.conditions || needObj.foundedModule) return
        // console.log(needObj.id);
        const neededModule = needObj.conditions(modules[idx])
        if (neededModule !== null) {
          foundCount++
          needObj.foundedModule = neededModule
          console.log(neededModule)
        }
      })
      if (foundCount === neededObjects.length) {
        break
      }
    }
  }

  neededObjects.forEach((needObj) => {
    if (needObj.foundedModule) {
      if (needObj.id !== 'module') {
        window.Store[needObj.id] = needObj.foundedModule
        console.log(needObj.id)
        console.log(needObj.foundedModule)
      }
    }
  })

  const module = neededObjects.filter((e) => e.id === 'module')[0].foundedModule
  Object.keys(module).forEach((key) => {
    if (!['Chat'].includes(key)) {
      if (window.Store[key]) {
        window.Store[key + '_'] = module[key]
      } else {
        window.Store[key] = module[key]
      }
    }
  })

  if (window.Store.MediaCollection) {
    window.Store.MediaCollection.prototype.processFiles =
      window.Store.MediaCollection.prototype.processFiles ||
      window.Store.MediaCollection.prototype.processAttachments
  }

  window.mR = async (find) => {
    return new Promise((resolve) => {
      if (window.__debug) {
        for (const idx in window.getModuleList()) {
          if (typeof modules[idx] === 'object' && modules[idx] !== null) {
            const module = modules[idx]

            var evet = module[find] ? module : null
            if (evet) {
              window[find] = evet
              return resolve(window[find])
            }
          }
        }
      } else {
        const parasite = `parasite${Date.now()}`
        window['webpackChunkwhatsapp_web_client'].push([
          [parasite],
          {},
          function (o) {
            const modules = []
            for (const idx in o.m) {
              modules.push(o(idx))
            }

            for (const idx in modules) {
              if (typeof modules[idx] === 'object' && modules[idx] !== null) {
                const module = modules[idx]

                var evet = module[find] ? module : null
                if (evet) {
                  window[find] = evet
                  return resolve(window[find])
                }
              }
            }
          },
        ])
      }
    })
  }

  window.injectToFunction = (selector, callback) => {
    ;(async () => {
      const Nr = await window.mR(selector)
      const oldFunct = Nr[selector]
      //console.log(selector, oldFunct);
      Nr[selector] = (...args) => callback(oldFunct, args)
    })()
  }

  window.injectToFunction('createMsgProtobuf', (func, args) => {
    const proto = func(...args)
    const [message] = args

    if (proto.listMessage) {
      proto.viewOnceMessage = {
        message: {
          listMessage: proto.listMessage,
        },
      }
      delete proto.listMessage
    }

    if (proto.buttonsMessage) {
      proto.viewOnceMessage = {
        message: {
          buttonsMessage: proto.buttonsMessage,
        },
      }
      delete proto.buttonsMessage
    }

    if (proto.templateMessage) {
      proto.viewOnceMessage = {
        message: {
          templateMessage: proto.templateMessage,
        },
      }
      delete proto.templateMessage
    }

    if (message.hydratedButtons) {
      const hydratedTemplate = {
        hydratedButtons: message.hydratedButtons,
      }

      if (message.footer) {
        hydratedTemplate.hydratedFooterText = message.footer
      }

      if (message.caption) {
        hydratedTemplate.hydratedContentText = message.caption
      }

      if (message.title) {
        hydratedTemplate.hydratedTitleText = message.title
      }

      if (proto.conversation) {
        hydratedTemplate.hydratedContentText = proto.conversation
        delete proto.conversation
      } else if (proto.extendedTextMessage?.text) {
        hydratedTemplate.hydratedContentText = proto.extendedTextMessage.text
        delete proto.extendedTextMessage
      } else {
        // Search media part in message
        let found
        const mediaPart = [
          'documentMessage',
          'imageMessage',
          'locationMessage',
          'videoMessage',
        ]
        for (const part of mediaPart) {
          if (part in proto) {
            found = part
            break
          }
        }

        if (!found) {
          return proto
        }

        // Media message doesn't allow title
        hydratedTemplate[found] = proto[found]

        // Copy title to caption if not setted
        if (
          hydratedTemplate.hydratedTitleText &&
          !hydratedTemplate.hydratedContentText
        ) {
          hydratedTemplate.hydratedContentText =
            hydratedTemplate.hydratedTitleText
        }

        // Remove title for media messages
        delete hydratedTemplate.hydratedTitleText

        if (found === 'locationMessage') {
          if (
            !hydratedTemplate.hydratedContentText &&
            (proto[found].name || proto[found].address)
          ) {
            hydratedTemplate.hydratedContentText =
              proto[found].name && proto[found].address
                ? `${proto[found].name}\n${proto[found].address}`
                : proto[found].name || proto[found].address || ''
          }
        }

        // Ensure a content text;
        hydratedTemplate.hydratedContentText =
          hydratedTemplate.hydratedContentText || ' '

        delete proto[found]
      }

      proto.templateMessage = {
        hydratedTemplate,
      }
    }

    return proto
  })

  window.injectToFunction('mediaTypeFromProtobuf', (func, ...args) => {
    const [proto] = args
    if (proto.viewOnceMessage?.message.templateMessage.hydratedTemplate) {
      return func(
        proto.viewOnceMessage?.message.templateMessage.hydratedTemplate
      )
    }
    return func(...args)
  })

  window.injectToFunction('typeAttributeFromProtobuf', (func, args) => {
    const [proto] = args
    console.log(`proto`, proto)

    if (proto.viewOnceMessage?.message.listMessage) {
      return 'text'
    }

    if (proto.imageMessage || proto.audioMessage) {
      return 'text'
    }

    if (
      proto.viewOnceMessage?.message?.buttonsMessage?.headerType === 1 ||
      proto.viewOnceMessage?.message?.buttonsMessage?.headerType === 2
    ) {
      return 'text'
    }

    if (proto.viewOnceMessage?.message.templateMessage.hydratedTemplate) {
      return 'text'
    }

    return 'text'
  })

  window.injectToFunction('createFanoutMsgStanza', async (func, args) => {
    const [, proto] = args

    let buttonNode = null

    if (proto.viewOnceMessage?.message.listMessage) {
      const listType = proto.viewOnceMessage?.message.listMessage?.listType || 0

      const types = ['unknown', 'single_select', 'product_list']

      buttonNode = Store.Websocket.smax('list', {
        v: '2',
        type: types[listType],
      })
    }

    const node = await func(...args)

    if (!buttonNode) {
      return node
    }

    const content = node.content

    let bizNode = content.find((c) => c.tag === 'biz')

    if (!bizNode) {
      bizNode = Store.Websocket.smax('biz', {}, null)
      content.push(bizNode)
    }

    let hasButtonNode = false

    if (Array.isArray(bizNode.content)) {
      hasButtonNode = !!bizNode.content.find((c) => c.tag === buttonNode?.tag)
    } else {
      bizNode.content = []
    }

    if (!hasButtonNode) {
      bizNode.content.push(buttonNode)
    }

    return node
  })
}
