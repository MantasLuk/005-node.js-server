const http = require('http');
const config = require('../config.js');

const server = {};

server.httpServer = http.createServer((req, res) => {
    // console.log('uzklausos pradzia...');
    //console.log(req.method, req.url);
    const baseURL = `http${req.socket.encrypted ? 's' : ''}://${req.headers.host}/`;
    const parseURL = new URL(req.url, baseURL);
    const httpMethod = req.method.toLowerCase();
    const parsedPathName = parseURL.pathname;
    const trimedPath = parsedPathName.replace(/^\/+|\/+$/g, '');
    const headers = req.headers;

    
    req.on('data', (data) => {
        console.log('gavau duomenis');
    })
    req.on('end', () => {
        // console.log('uzklausos pabaiga');
        let responseContent = '';
        if(req.url === '/'){
            responseContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Server</title>
            </head>
            <body>
                SERVER CONTENT - ${config.envName}
            </body>
            </html>`;
        } else {
            responseContent = 'ERROR!'
        }

        return res.end(responseContent);
    })
})

server.init = () => {
    //console.log(config);
    //console.log('inicijuojame serveri...');
    server.httpServer.listen(config.httpPort, () => {
    console.log(`Tavo serveris sukasi ant http://localhost:${config.httpPort} `);
    });
}

module.exports = server;