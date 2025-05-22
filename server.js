const express = require('express')
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { Server } = require('socket.io')
const http = require('http')
const fs = require('fs-extra')
const QRCode = require('qrcode')
const { Storage } = require('megajs')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(__dirname + '/public'))

app.get('/', (_, res) => res.sendFile(__dirname + '/public/index.html'))

io.on('connection', async (socket) => {
  console.log('🔌 Client connected')

  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  })

  sock.ev.on('connection.update', async ({ connection, qr }) => {
    if (qr) {
      const qrImage = await QRCode.toDataURL(qr)
      socket.emit('qr', qrImage)
    }

    if (connection === 'open') {
      await saveCreds()
      console.log('✅ Connected. Uploading to Mega.nz...')

      const credsBuffer = await fs.readFile('auth_info_baileys/creds.json')

      const storage = new Storage({
        email: 'sinirot419@ofular.com',
        password: '1b1e7FFD#.-'
      })

      storage.on('ready', () => {
        const file = storage.upload({ name: 'creds.json', size: credsBuffer.length }, credsBuffer)
        file.on('complete', () => {
          const sessionId = file.downloadId
          console.log('📤 Session uploaded: ', sessionId)
          socket.emit('session-id', sessionId)
        })
      })

      storage.on('error', err => console.error('❌ Mega Error:', err))
      storage.login()
    }
  })
})

server.listen(3000, () => {
  console.log('🌐 Server running on http://localhost:3000')
})
