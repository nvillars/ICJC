(async () => {
  const root = await fetch('http://localhost:3000')
  console.log('root', root.status)
  const login = await fetch('http://localhost:3000/admin/login', { redirect: 'manual' })
  console.log('login', login.status, 'location:', login.headers.get('location'))
})().catch(e => { console.error(e); process.exit(1) })
