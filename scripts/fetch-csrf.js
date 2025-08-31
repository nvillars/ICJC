(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/auth/csrf')
    console.log('status', res.status)
    console.log('content-type', res.headers.get('content-type'))
    const text = await res.text()
    console.log('body:\n', text.slice(0, 2000))
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
