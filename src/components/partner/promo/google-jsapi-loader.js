export function core() {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.async = true
    s.src = 'https://www.google.com/jsapi'
    document.getElementsByTagName('body')[0].appendChild(s)

    let retries = 0
    let interval

    function ready() {
      if (global && global.google) {
        clearInterval(interval)
        return resolve()
      } else if (retries > 5) {
        return reject()
      }
      retries++
    }

    interval = setInterval(ready, 300)
  })
}

export function visualization() {
  return core().then(() => new Promise(resolve => {
    global.google.load('visualization', '1', {
      packages: ['corechart'],
      language: 'ru',
      callback: () => resolve()
    })
  }))
}
