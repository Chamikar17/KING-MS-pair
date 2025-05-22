const express = require('express')
const { makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
const { default: pino } = require('pino')
const fs = require('fs-extra')
const { Storage } = require('megajs')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static('public'))

app.get('/', (_, res) => res.sendFile(__dirname + '/public/index.html'))

io.on('connection', async (socket) => {
  console.log('🔌 New Client Connected')

  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['PairCodeGen', 'Safari', '1.0.0']
  })

  sock.ev.on('connection.update', async (update) => {
    const { connection, pairingCode } = update

    if (pairingCode) {
      console.log('📲 Pairing Code:', pairingCode)
      socket.emit('pair-code', pairingCode)
    }

    if (connection === 'open') {
      console.log('✅ Connected! Uploading session...')
      await saveCreds()
      const creds = await fs.readFile('auth_info_baileys/creds.json')

      const storage = new Storage({
        email: 'sinirot419@ofular.com',
        password: '1b1e7FFD#.-'
      })

      storage.on('ready', () => {
        const file = storage.upload({ name: 'creds.json', size: creds.length }, creds)
        file.on('complete', () => {
          console.log('✅ Uploaded to Mega!')
          socket.emit('session-id', file.downloadId)
          process.exit(0)
        })
      })

      storage.login()
    }
  })
})

server.listen(3000, () => {
  console.log('🌐 Server running at http://localhost:3000')
})
