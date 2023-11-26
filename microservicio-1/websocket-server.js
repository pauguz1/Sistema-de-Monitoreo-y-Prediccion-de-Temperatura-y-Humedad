const WebSocket = require('ws');

const channels = {}; // Almacena las conexiones de cada canal

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  let currentChannel = null;

  ws.on('message', function incoming(message) {
    //const buffer = Buffer.from(message, 'utf-8');
    //console.log('mensaje:',buffer.toString('utf-8'));
    
    const data = JSON.parse(message);

    if (data.type === 'subscribe') {
      const { channel } = data;
      if (!channels[channel]) {
        channels[channel] = new Set();
      }
      channels[channel].add(ws);
      currentChannel = channel;
      console.log(`Usuario suscrito al canal ${channel}`);
    } else if (data.type === 'message' && currentChannel) {
      const { content: content } = data;
      const channelClients = channels[currentChannel];
      if (channelClients) {
        for (let client of channelClients) {
          if ( client.readyState === WebSocket.OPEN) {
            //client.send(JSON.stringify({ sender: currentChannel, content }));
            client.send(JSON.stringify({content}));
          }
        }
      }
    }
  });

  ws.on('close', function() {
    if (currentChannel && channels[currentChannel]) {
      channels[currentChannel].delete(ws);
      console.log(`Usuario desconectado del canal ${currentChannel}`);
    }
  });
});

console.log('Servidor WebSocket iniciado en el puerto 8080');
