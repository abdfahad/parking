const express = require('express');
var fs = require('fs');
const { Server } = require('socket.io');

const app = express();
const cors = require('cors')

app.use(cors());
app.use(express.static(__dirname + '/FrontEnd'));

app.use(express.json());
const Port = process.env.PORT || 3000;

const server = require('http').createServer(app);
const io = new Server(server, {
  transports: ['websocket', 'polling'],
})

io.on('connection', function(socket) {
    
  console.log('Socket connected');
  socket.on('message', sensorData =>{
    console.log(sensorData);
  })
    
});


var index = fs.readFileSync( './FrontEnd/index.html');

app.use(express.json());

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js', {
    headers: {
      'Content-Type': 'text/javascript',
    },
  });
});

app.get('/FrontEnd', (req,res,next)=>{
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
  
})

app.post('/sensorData', function (req,res,next) {
  let data = req.body;
  console.log(`posted to /sensorData : ${data}`);
  io.emit('data', data);
  res.sendStatus(200);
});

server.listen(Port, ()=>{
    console.log(`Server Running at port ${Port}`);
});
