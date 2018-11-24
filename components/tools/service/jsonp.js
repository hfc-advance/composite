
export async function jsonp (url, data = {}) {
  if (!url) throw new Error('The url cannot be empty')
  let script = document.createElement('script')
  let callback = `jsonp${Math.random().toString(16).slice(2)}`
  let src = /^.*\?.*$/.test(url) ? `${url}&callback=${callback}` : `${url}?callback=${callback}`
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      src += `&${key}=${data[key]}`
    }
  }
  script.src = src
  script.type = 'text/javascript'
  script.language = 'script'
  document.body.appendChild(script)
  let successPromise = new Promise(resolve => {
    window[callback] = (data) => {
      console.log(data)
      resolve()
    }
  })
  let failPromise = new Promise((resolve, reject) => {
    script.onerror = (...arg) => {
      reject(new Error(1))
    }
  })
  return Promise.race([successPromise, failPromise])
}
