export async function scrapeImg(page) {
  var result = await page.evaluate(() => {
    const selectorimg = document.querySelector('canvas');
    let selectorUrl = document.querySelector('._1QMFu');

    if (selectorimg != null && selectorUrl != null) {
      let data = {
        img: selectorimg.toDataURL(),
        url: selectorUrl.getAttribute('data-ref'),
      };
      return data;
    } else {
      return void 0;
    }
  });

  return result;
}
