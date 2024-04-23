export async function downloadFile(url) {
  return await new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          const reader = new FileReader()
          reader.readAsDataURL(xhr.response)
          reader.onload = function () {
            resolve(reader.result.substr(reader.result.indexOf(',') + 1))
          }
        } else {
          console.error(xhr.statusText)
        }
      } else {
        // console.log(err);
        resolve(false)
      }
    }
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.send(null)
  })
}
