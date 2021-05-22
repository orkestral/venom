import { Page, Browser } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { GroupLayer } from './group.layer';

export class UILayer extends GroupLayer {
  constructor(
    public browser: Browser,
    public page: Page,
    session?: string,
    options?: CreateConfig
  ) {
    super(browser, page, session, options);
  }

  /**
   * checks and returns whether a message and a reply
   * @param messages
   */
  public async returnReply(messages: any) {
    return await this.page.evaluate(
      ({ messages }) => WAPI.returnReply(messages),
      {
        messages,
      }
    );
  }

  /**
   * Opens given chat at last message (bottom)
   * Will fire natural workflow events of whatsapp web
   * @param chatId
   */
  public async openChat(chatId: string) {
    return this.page.evaluate(
      (chatId: string) => WAPI.openChat(chatId),
      chatId
    );
  }

  /**
   * Opens chat at given message position
   * @param chatId Chat id
   * @param messageId Message id (For example: '06D3AB3D0EEB9D077A3F9A3EFF4DD030')
   */
  public async openChatAt(chatId: string, messageId: string) {
    return this.page.evaluate(
      (chatId: string) => WAPI.openChatAt(chatId, messageId),
      chatId
    );
  }
}
