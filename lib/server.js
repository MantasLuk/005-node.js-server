const http = require('http');
const config = require('../config.js');
const file = require('./file.js');
const utils = require('./utils.js');

const server = {};

server.httpServer = http.createServer((req, res) => {
    const baseURL = `http${req.socket.encrypted ? 's' : ''}://${req.headers.host}/`;
    const parsedURL = new URL(req.url, baseURL);
    const httpMethod = req.method.toLowerCase();
    const parsedPathName = parsedURL.pathname;
    const trimmedPath = parsedPathName.replace(/^\/+|\/+$/g, '');
    const headers = req.headers;

    /* 
    tekstiniai failai:
        - css faila
        - js faila
        - svg faila
    binariniai failai:
        - png/jpg/ico (nuotraukos) faila
        - woff (sriftu) faila
        - media (audio, video) faila
    API
    html turini
    */

    const fileExtension = utils.fileExtension(trimmedPath);
    const textFileExtensions = ['css', 'js', 'svg'];
    const binaryFileExtensions = ['eot', 'ttf', 'woff', 'woff2', 'otf', 'png', 'jpg', 'ico'];
    const isTextFile = textFileExtensions.includes(fileExtension);
    const isBinaryFile = binaryFileExtensions.includes(fileExtension);
    const isAPI = false;
    const isPage = !isTextFile && !isBinaryFile && !isAPI;

    req.on('data', (data) => {
        console.log('gavau duomenis...');
    })

    req.on('end', async () => {
        let responseContent = '';

        if (isTextFile) {
            responseContent = await file.read('public', trimmedPath);
            if (responseContent === false) {
                responseContent = `ERROR: problema bandant perskaityti faila "${trimmedPath}"`;
            }
        }

        if (isBinaryFile) {
            responseContent = await file.readBinary('public', trimmedPath);
            if (responseContent === false) {
                responseContent = `ERROR: problema bandant perskaityti faila "${trimmedPath}"`;
            }
        }

        if (isAPI) {
            responseContent = 'API';
        }

        if (isPage) {
            responseContent = await file.read('html', trimmedPath + '/index.html');
            if (responseContent === false) {
                responseContent = await file.read('html', '404/index.html');
            }
        }

        return res.end(responseContent);
    })
})

server.init = () => {
    server.httpServer.listen(config.httpPort, () => {
        console.log(`Tavo serveris sukasi ant http://localhost:${config.httpPort}`);
    });
}

module.exports = server;