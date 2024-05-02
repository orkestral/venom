import { EventEmitter } from 'events'
import { Page, Browser } from 'puppeteer'
import { CreateConfig } from '../../config/create-config'
import { ExposedFn } from '../helpers/exposed.enum'
import {
  Ack,
  Chat,
  LiveLocation,
  Message,
  ParticipantEvent,
  PicTumb,
  ChatStatus,
  Revoke,
} from '../model'
import { SocketState, SocketStream } from '../model/enum'
import { InterfaceChangeMode } from '../model'
import { InterfaceMode } from '../model/enum/interface-mode'
import { InterfaceState } from '../model/enum/interface-state'
import { ProfileLayer } from './profile.layer'
import { callbackWile } from '../helpers'
import { logger } from '../../utils/logger'

declare global {
  interface Window {
    onMessage: any
    onAnyMessage: any
    onStateChange: any
    onIncomingCall: any
    onAck: any
    onRevoked: any
    onStreamChange: any
    onFilePicThumb: any
    onChatState: any
    onUnreadMessage: any
    onInterfaceChange: any
    onAddedToGroup: any
    func: any
    onLiveLocation: any
    waitNewMessages: any
    onPoll: any
  }
}

export class ListenerLayer extends ProfileLayer {
  private listenerEmitter = new EventEmitter()
  // TODO - Study and refactor these callbacks
  private callonMessage = new callbackWile()
  private callOnack = new callbackWile()

  constructor(
    public browser: Browser,
    public page: Page,
    session?: string,
    options?: CreateConfig
  ) {
    super(browser, page, session, options)

    this.page.on('close', () => {
      this.cancelAutoClose()
      logger.error('Page Closed')
    })
  }

  // TODO fix interface state loading forever
  public async initialize() {
    try {
      const functions = [...Object.values(ExposedFn)]

      for (const func of functions) {
        const has = await this.page
          .evaluate((func) => typeof window[func] === 'function', func)
          .catch((error) => {
            logger.error(
              `Error in listener.layer.ts -> initialize(): ${error.message} stack: ${error.stack}`
            )
            return false
          })

        if (!has) {
          await this.page
            .exposeFunction(func, (...args: any) =>
              this.listenerEmitter.emit(func, ...args)
            )
            .catch((error) => {
              logger.error(
                `Error in listener.layer.ts -> initialize(): ${error.message} stack: ${error.stack}`
              )
            })
        }
      }

      await this.addMsg()
      await this.page.evaluate(() => {
        window.WAPI.onInterfaceChange((e: any) => {
          window.onInterfaceChange(e)
        })
        window.WAPI.onStreamChange((e: any) => {
          window.onStreamChange(e)
        })
        window.WAPI.onChatState((e: any) => {
          window.onChatState(e)
        })
        window.WAPI.onStateChange((e: any) => {
          window.onStateChange(e)
        })
        window.WAPI.onUnreadMessage((e: any) => {
          window.onUnreadMessage(e)
        })
        window.WAPI.waitNewMessages(false, (data: any) => {
          data.forEach((message: any) => {
            window.onMessage(message)
          })
        })
        window.WAPI.onAddedToGroup((e: any) => {
          window.onAddedToGroup(e)
        })
        window.WAPI.onAck((e: any) => {
          window.onAck(e)
        })
        window.WAPI.onRevoked((e: any) => {
          window.onRevoked(e)
        })
        window.WAPI.onPoll((e: any) => {
          window.onPoll(e)
        })
      })
    } catch (error) {
      logger.error(
        `Error in listener.layer.ts -> initialize(): ${error.message} stack: ${error.stack}`
      )
    }
  }

  public async addMsg() {
    await this.page.evaluate(() => {
      let isHeroEqual = {}
      window.WAPI.waitForStore(['Chat', 'Msg'], () => {
        window.Store.Msg.on('add', async (newMessage) => {
          if (!Object.is(isHeroEqual, newMessage)) {
            isHeroEqual = newMessage
            if (newMessage && newMessage.isNewMsg) {
              const processMessageObj = await window.WAPI.processMessageObj(
                newMessage,
                true,
                false
              )
              window.onAnyMessage(processMessageObj)
            }
          }
        })
      })
    })
  }

  public async onPoll(fn: (ack: any) => void) {
    this.listenerEmitter.on(ExposedFn.onPoll, (e) => {
      fn(e)
    })

    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onPoll, (e) => {
          fn(e)
        })
      },
    }
  }

  /**
   * @event Listens to all new messages
   * @param to callback
   * @fires Message
   */
  public async onAnyMessage(fn: (message: Message) => void) {
    this.listenerEmitter.on(ExposedFn.OnAnyMessage, (msg) => {
      fn(msg)
    })

    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.OnAnyMessage, (msg) => {
          fn(msg)
        })
      },
    }
  }

  /**
   * @event Listens to messages received
   * @returns Observable stream of messages
   */
  public async onStateChange(fn: (state: SocketState) => void) {
    this.listenerEmitter.on(ExposedFn.onStateChange, fn)

    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onStateChange, fn)
      },
    }
  }

  /**
   * @returns Returns chat state
   */
  public async onChatState(fn: (state: ChatStatus) => void) {
    this.listenerEmitter.on(ExposedFn.onChatState, (state: ChatStatus) => {
      fn(state)
    })
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onChatState, fn)
      },
    }
  }

  ////////////////////////////////////////////////////
  /**
   * @returns Returns the current state of the connection
   */
  public async onStreamChange(fn: (state: SocketStream) => void) {
    this.listenerEmitter.on(ExposedFn.onStreamChange, (state: SocketStream) => {
      fn(state)
    })
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onStreamChange, fn)
      },
    }
  }

  /**
   * @event Listens to interface mode change See {@link InterfaceState} and {@link InterfaceMode} for details
   * @returns A disposable object to cancel the event
   */
  public async onInterfaceChange(
    fn: (state: {
      displayInfo: InterfaceState
      mode: InterfaceMode
      info: InterfaceState
    }) => void | InterfaceChangeMode | Promise<any>
  ) {
    this.listenerEmitter.on(ExposedFn.onInterfaceChange, fn)

    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onInterfaceChange, fn)
      },
    }
  }

  //////////////////////////////////////PRO
  /**
   * @returns Returns new UnreadMessage
   */
  public async onUnreadMessage(fn: (unread: Message) => void) {
    this.listenerEmitter.on(ExposedFn.onUnreadMessage, fn)
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onUnreadMessage, fn)
      },
    }
  }

  /**
   * @returns Returns new PicThumb
   */
  public async onFilePicThumb(fn: (pic: PicTumb) => void) {
    this.listenerEmitter.on(ExposedFn.onFilePicThumb, fn)
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onFilePicThumb, fn)
      },
    }
  }

  /**
   * @event Listens to messages received
   * @returns Observable stream of messages
   */
  public async onMessage(fn: (message: Message) => void) {
    this.listenerEmitter.on(ExposedFn.OnMessage, (state: Message) => {
      if (!this.callonMessage.checkObj(state.from, state.id)) {
        this.callonMessage.addObjects(state.from, state.id)
        fn(state)
      }
    })
    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.OnMessage, (state: Message) => {
          if (!this.callonMessage.checkObj(state.from, state.id)) {
            this.callonMessage.addObjects(state.from, state.id)
            fn(state)
          }
        })
      },
    }
  }

  /**
   * @event Listens to messages acknowledgement Changes
   * @returns Observable stream of messages
   */
  public async onAck(fn: (ack: Ack) => void) {
    this.listenerEmitter.on(ExposedFn.onAck, (e: Ack) => {
      if (!this.callOnack.checkObj(e.ack, e.id._serialized)) {
        const key = this.callOnack.getObjKey(e.id._serialized)
        if (key) {
          this.callOnack.module[key].id = e.ack
          fn(e)
        } else {
          this.callOnack.addObjects(e.ack, e.id._serialized)
          fn(e)
        }
      }
    })

    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onAck, (e: Ack) => {
          if (!this.callOnack.checkObj(e.ack, e.id._serialized)) {
            const key = this.callOnack.getObjKey(e.id._serialized)
            if (key) {
              this.callOnack.module[key].id = e.ack
              fn(e)
            } else {
              this.callOnack.addObjects(e.ack, e.id._serialized)
              fn(e)
            }
          }
        })
      },
    }
  }

  /**
   * @event Listens to messages revoked changes
   * @returns Observable stream of messages
   */
  // TODO - Remover any
  public async onRevoked(fn: (revoke: Revoke) => void) {
    this.listenerEmitter.on(ExposedFn.onRevoked, fn)

    return {
      dispose: () => {
        this.listenerEmitter.off(ExposedFn.onRevoked, fn)
      },
    }
  }

  /**
   * @event Listens to live locations from a chat that already has valid live locations
   * @param chatId the chat from which you want to subscribes to live location updates
   * @param fn callback that takes in a LiveLocation
   * @returns boolean, if returns false then there were no valid live locations in the chat of chatId
   * @emits <LiveLocation> LiveLocation
   */
  public async onLiveLocation(
    chatId: string,
    fn: (liveLocationChangedEvent: LiveLocation) => void
  ) {
    const method = 'onLiveLocation_' + chatId.replace(/_/g, '')
    return this.page
      .exposeFunction(method, (liveLocationChangedEvent: LiveLocation) =>
        fn(liveLocationChangedEvent)
      )
      .then(() =>
        this.page.evaluate(
          ({ chatId, method }) => {
            //@ts-ignore
            return WAPI.onLiveLocation(chatId, window[method])
          },
          { chatId, method }
        )
      )
      .catch((error) => {
        logger.error(
          `Error in listener.layer.ts -> onLiveLocation():${JSON.stringify(
            error
          )}`
        )
      })
  }

  /**
   * @event Listens to participants changed
   * @param to group id: xxxxx-yyyy@us.c
   * @param to callback
   * @returns Stream of ParticipantEvent
   */
  public async onParticipantsChanged(
    groupId: string,
    fn: (participantChangedEvent: ParticipantEvent) => void
  ) {
    const method = 'onParticipantsChanged_' + groupId.replace(/_/g, '')
    return this.page
      .exposeFunction(method, (participantChangedEvent: ParticipantEvent) =>
        fn(participantChangedEvent)
      )
      .then(() =>
        this.page.evaluate(
          ({ groupId, method }) => {
            //@ts-ignore
            WAPI.onParticipantsChanged(groupId, window[method])
          },
          { groupId, method }
        )
      )
      .catch((error) => {
        logger.error(
          `Error in listener.layer.ts -> onParticipantsChanged():${JSON.stringify(
            error
          )}`
        )
      })
  }

  /**
   * @event Fires callback with Chat object every time the host phone is added to a group.
   * @param to callback
   * @returns Observable stream of Chats
   */
  public async onAddedToGroup(fn: (chat: Chat) => any) {
    this.listenerEmitter.on('onAddedToGroup', fn)

    return {
      dispose: () => {
        this.listenerEmitter.off('onAddedToGroup', fn)
      },
    }
  }

  /**
   * @event Listens to messages received
   * @returns Observable stream of messages
   */
  public async onIncomingCall(fn: (call: any) => any) {
    this.listenerEmitter.on('onIncomingCall', fn)

    return {
      dispose: () => {
        this.listenerEmitter.off('onIncomingCall', fn)
      },
    }
  }
}
