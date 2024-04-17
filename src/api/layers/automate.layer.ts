import { ListenerLayer } from './listener.layer'
import { Mutex } from 'async-mutex'
import { Browser, Page } from 'puppeteer'
import { CreateConfig } from '../../config/create-config'

export class AutomateLayer extends ListenerLayer {
  private typingMutex: Mutex

  constructor(
    public browser: Browser,
    public page: Page,
    session?: string,
    options?: CreateConfig
  ) {
    super(browser, page, session, options)
    this.typingMutex = new Mutex()
  }

  private async selectChatViaTyping(chatId: string): Promise<boolean> {
    const xpath = '//*[@id="side"]/div[1]/div/div[2]/div[2]/div/div[1]/p'
    const ids = await this.page.evaluate(() => {
      return WAPI.getAllChatIds()
    })
    if (!ids.includes(chatId)) {
      return false
    }

    try {
      const search_element = await this.page.waitForXPath(xpath, {
        timeout: 1000,
      })
      // @ts-ignore
      await search_element.click()
      const phone_number = chatId.replace('@c.us', '')
      await this.page.keyboard.type(' ' + phone_number + '\n', { delay: 200 })
      await this.page.waitForTimeout(3000)
      return true
    } catch (error) {
      return false
    }
  }

  private async typeMultiLine(content: string): Promise<void> {
    content = content.replace('\r', '\n')
    const lines = content.split(/\r?\n/)

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index]
      await this.page.keyboard.type(line, { delay: 200 })
      await this.page.keyboard.down('Shift')
      // Press the Enter key while the Shift key is down
      await this.page.keyboard.press('Enter')
      // Release the Shift key
      await this.page.keyboard.up('Shift')
    }
  }

  /**
   * Sends a photo or video to given chat, by injecting keystrokes
   * @param to chat id: xxxxx@us.c
   * @param fileName full path to media file
   * @param caption media caption
   */
  public async sendPhotoVideoViaTyping(
    to: string,
    fileName: string,
    caption: string = ''
  ): Promise<boolean> {
    const release = await this.typingMutex.acquire()
    const success = await this.selectChatViaTyping(to)
    if (!success) {
      release()
      return false
    }

    const plus_button_xpath =
      '//*[@id="main"]/footer/div[1]/div/span[2]/div/div[1]/div[2]/div/div/div/span'
    try {
      const plus_button = await this.page.waitForXPath(plus_button_xpath)
      // @ts-ignore
      await plus_button.click()
    } catch (error) {
      release()
      return false
    }

    for (let i = 0; i < 5; i++) {
      await this.page.keyboard.press('ArrowUp')
      await this.page.waitForTimeout(500)
    }

    const [fileChooser] = await Promise.all([
      this.page.waitForFileChooser(),
      this.page.evaluate(() => {
        // @ts-ignore
        document.activeElement.click()
      }),
    ])
    await fileChooser.accept([fileName])

    await this.page.waitForTimeout(1000)
    await this.typeMultiLine(caption)
    await this.page.keyboard.press('Enter')

    release()
    return true
  }

  /**
   * Sends a text message to given chat, by injecting keystrokes
   * @param to chat id: xxxxx@us.c
   * @param content text message
   */
  public async sendTextViaTyping(to: string, content: string) {
    const release = await this.typingMutex.acquire()
    const success = await this.selectChatViaTyping(to)
    if (success) {
      release()
      return false
    }

    await this.typeMultiLine(content)
    await this.page.keyboard.press('Enter')
    release()
    return true
  }
}
