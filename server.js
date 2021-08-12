const fs = require('fs')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const express = require('express')
const socketio = require('socket.io')
const https = require('https')
const app = express()
const bodyParser = require('body-parser')
const server = https.createServer({
    key: fs.readFileSync('./key/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
}, app);
const io = socketio(server,{
    cors: { origin: "*" }
});
const PORT_SOCKET = 8000;

const router = require('./router');

const RealTime = require('./RealTime.js')

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(cors())
app.use(fileUpload())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})
app.use('/', router)

io.on('connection', (socket) => {
    RealTime(io, socket); 
})

server.listen(process.env.PORT || PORT_SOCKET, () => console.log(`Server has started on port ${PORT_SOCKET}`))