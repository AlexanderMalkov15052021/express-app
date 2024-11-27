const express = require('express');
const app = express();
const path = require('path');



const ws = require('ws');



app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
})

app.listen(process.env.PORT || 3000);







const wsServer = new ws.Server({ port: 4000 });

function onConnect(wsClient) {
    console.log('New client');

    wsClient.send('Hellow!');

    wsClient.on('message', function (message) {
        try {

            const jsonMessage = JSON.parse(message);

            console.log(jsonMessage);

            switch (jsonMessage.action) {
                case 'ECHO':
                    wsClient.send(jsonMessage.data);
                    break;
                case 'PING':
                    setTimeout(function () {
                        wsClient.send('PONG');
                    }, 1000);
                    break;
                default:
                    console.log('Unknown command');
                    break;
            }

        } catch (error) {
            console.log('Error', error);
        }
    });

    wsClient.on('close', function () {

        console.log('Client disconnected');
    });
}

wsServer.on('connection', onConnect);






module.exports = app;