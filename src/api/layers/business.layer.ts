import { Browser, Page } from 'puppeteer';
import { ControlsLayer } from './controls.layer';

export class BusinessLayer extends ControlsLayer {
  constructor(public page: Page, public browser: Browser) {
    super(browser, page);
  }

  /**
   * Querys product catalog
   * @param id Buisness profile id ('00000@c.us')
   */
  public async getBusinessProfilesProducts(id: string) {
    return this.page.evaluate(
      ({ id }) => {
        WAPI.getBusinessProfilesProducts(id);
      },
      { id }
    );
  }

  /**
   * Sends product with product image to given chat id
   * @param to Chat id
   * @param base64 Base64 image data
   * @param caption Message body
   * @param businessId Business id number that owns the product ('0000@c.us')
   * @param productId Product id, see method getBusinessProfilesProducts for more info
   */
  public async sendImageWithProduct(
    to: string,
    base64: string,
    caption: string,
    businessId: string,
    productId: string
  ) {
    return this.page.evaluate(
      ({ to, base64, businessId, caption, productId }) => {
        WAPI.sendImageWithProduct(base64, to, caption, businessId, productId);
      },
      { to, base64, businessId, caption, productId }
    );
  }
}
