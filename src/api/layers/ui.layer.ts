import { Page, Browser } from 'puppeteer';
import { CreateConfig } from '../../config/create-config';
import { GroupLayer } from './group.layer';
import { checkValuesSender } from '../helpers/layers-interface';

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
   * MouveMouse
   */
  public async mouseMove(x: number, y: number) {
    await this.page.mouse.move(0, 0);
    await this.page.mouse.down();
    await this.page.mouse.move(0, 100);
    await this.page.mouse.up();
  }

  /**
   * checks and returns whether a message and a reply
   * @param messages
   */
  public async returnReply(messages: any) {
    return await this.page.evaluate(
      ({ messages }) => WAPI.returnReply(messages),
      {
        messages
      }
    );
  }

  /**
   * Opens given chat at last message (bottom)
   * Will fire natural workflow events of whatsapp web
   * @param chatId
   */
  public async openChat(chatId: string, force?: boolean) {
    return new Promise(async (resolve, reject) => {
      const typeFunction = 'openChat';
      const type = 'string';
      const check = [
        {
          param: 'text',
          type: type,
          value: chatId,
          function: typeFunction,
          isUser: true
        }
      ];
      const validating = checkValuesSender(check);
      if (typeof validating === 'object') {
        return reject(validating);
      }
      const result = await this.page.evaluate(
        ({ chatId, force }) => WAPI.openChat(chatId, force),
        { chatId, force }
      );

      if (result['erro'] == true) {
        return reject(result);
      } else {
        return resolve(result);
      }
    });
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
