export async function scrapeLogin(page): Promise<boolean> {
  var result = await page.evaluate(() => {
    let count = document.querySelector('._9a59P');
    var data: boolean;
    data = false;
    if (count != null) {
      var text = count.textContent,
        timeNumber = text.match('Invalid');
      if (timeNumber) {
        data = true;
      }
      return data;
    }
  });
  return result;
}
