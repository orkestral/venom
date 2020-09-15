export async function scrapeImgReload(page, url) {
  let click = await page.evaluate(() => {
    let bt = document.querySelector('._3IKPF');
    if (bt != null) {
      return true;
    } else {
      return void 0;
    }
  });
  if (click != undefined) {
    page.click('._3IKPF');
    await page.waitForNavigation();
    console.log('Load button pressed');
  }
  var result = await page.evaluate(() => {
    let selector = document.querySelector('._1QMFu');
    if (selector != null) {
      return selector.getAttribute('data-ref');
    } else {
      return void 0;
    }
  });
  if (result != undefined) {
    if (typeof url == 'undefined' || url == null) {
      return { url: result, status: false };
    } else {
      if (result != url) {
        url = result;
        return { url: result, status: true };
      } else {
        return { url: result, status: false };
      }
    }
  } else {
    return void 0;
  }
}
