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
    const textFileExtensions = ['css', 'js', 'svg','webmanifest'];
    const binaryFileExtensions = ['eot', 'ttf', 'woff', 'woff2', 'otf', 'png', 'jpg', 'ico'];
    const isTextFile = textFileExtensions.includes(fileExtension);
    const isBinaryFile = binaryFileExtensions.includes(fileExtension);
    const isAPI = false;
    const isPage = !isTextFile && !isBinaryFile && !isAPI;

    const MIMES = {
        html: 'text/html',
        css: 'text/css',
        js: 'text/javascript',
        svg: 'image/svg+xml',
        png: 'image/png',
        jpg: 'image/jpeg',
        ico: 'image/x-icon',
        woff2: 'font/woff2',
        woff: 'font/woff',
        ttf: 'font/ttf',
        otf: 'font/otf',
        eot: 'application/vnd.ms-fontobject',
        webmanifest: 'application/manifest+json',
        pdf: 'application/pdf',
    };

    req.on('data', (data) => {
        console.log('gavau duomenis...');
    })

    req.on('end', async () => {
        let responseContent = '';

        if (isTextFile) {
            responseContent = await file.read('public', trimmedPath);
            if (responseContent === false) {
                res.writeHead(404);
                responseContent = `ERROR: problema bandant perskaityti faila "${trimmedPath}"`;
            } else {
                res.writeHead(200, {
                    'Content-Type': MIMES[fileExtension],
                })
            }
        }

        if (isBinaryFile) {
            responseContent = await file.readBinary('public', trimmedPath);
            if (responseContent === false) {
                res.writeHead(404);
                responseContent = `ERROR: problema bandant perskaityti faila "${trimmedPath}"`;
            } else {
                res.writeHead(200, {
                    'Content-Type': MIMES[fileExtension],
                })
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

            const headHomeHTML = await file.read('components', 'head-home.html');
            const headBlogHTML = await file.read('components', 'head-blog.html');
            const headAuthHTML = await file.read('components', 'head-auth.html');
            const headerHTML = await file.read('components', 'header.html');
            const headerInnerHTML = await file.read('components', 'header-inner.html');
            const footerHTML = await file.read('components', 'footer.html');
            responseContent = responseContent.replace('{{HEAD-HOME}}', headHomeHTML);
            responseContent = responseContent.replace('{{HEAD-BLOG}}', headBlogHTML);
            responseContent = responseContent.replace('{{HEAD-AUTH}}', headAuthHTML);
            responseContent = responseContent.replace('{{HEADER}}', headerHTML);
            responseContent = responseContent.replace('{{HEADER-INNER}}', headerInnerHTML);
            responseContent = responseContent.replace('{{FOOTER}}', footerHTML);

            res.writeHead(200, {
                'Content-Type': MIMES.html,
            })
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