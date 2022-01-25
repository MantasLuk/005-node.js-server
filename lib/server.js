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
            responseContent = `<!DOCTYPE html>
                <html lang="en">

                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <link rel="stylesheet" href="./css/pages/home.css">
                    <link rel="stylesheet" href="./css/pages/home2.css">
                </head>

                <body>
                    <header class="container header">
                        <div class="row">
                            <img src="./img/logo.png" alt="Logo" class="logo">
                            <img src="./img/logo2.png" alt="Logo" class="logo">
                            <nav>
                                <a href="./blog/">Blog</a>
                                <a href="./register/">Register</a>
                                <a href="./login/">Log in</a>
                            </nav>
                        </div>
                    </header>

                    <main>
                        <section class="container hero">
                            <div class="row">
                                <div class="left">
                                    <h1>Your Full-Funnel Growth Agency</h1>
                                    <p>Capture and retrieve your lists across devices to help you stay organized at work, home, and on the go.</p>
                                    <a href="#" class="btn">Get started</a>
                                </div>
                                <div class="right">
                                    <img src="./img/hero.png" alt="Hero image">
                                </div>
                            </div>
                        </section>

                        <section class="container bg-gradient services">
                            <div class="row">
                                <h2>Services</h2>
                                <p>Each time a digital asset is purchased or sold, Sequoir donates a percentage of the fees back into the development of the asset through its charitable foundation.</p>
                            </div>
                            <div class="row services-list">
                                <div class="service">
                                    <i class="icon fa fa-globe"></i>
                                    <h3 class="title">Paid Search and Social Management</h3>
                                    <p class="description">Each time a digital asset is purchased or sold, Sequoir donates a percentage of the fees back</p>
                                </div>
                                <div class="service">
                                    <i class="icon fa fa-globe"></i>
                                    <h3>Direct Response Content</h3>
                                    <p>Each time a digital asset is purchased or sold, Sequoir donates a percentage of the fees back</p>
                                </div>
                                <div class="service">
                                    <i class="icon fa fa-globe"></i>
                                    <h3>CRO and Retention Optimizations</h3>
                                    <p>Each time a digital asset is purchased or sold, Sequoir donates a percentage of the fees back</p>
                                </div>
                            </div>
                        </section>

                        <section class="container contacts">
                            <div class="row">
                                <div class="left">
                                    <h2>Let’s scale your brand, together</h2>
                                    <p>Get a start@oxo.com</p>
                                    <img src="./img/contacts.png" alt="Contacts image">
                                </div>
                                <form class="right form">
                                    <div class="form-row">
                                        <label for="name">Name</label>
                                        <input id="name" type="text" placeholder="Type name" required>
                                    </div>
                                    <div class="form-row">
                                        <label for="phone">Phone</label>
                                        <input id="phone" type="tel" placeholder="Type phone number" required>
                                    </div>
                                    <div class="form-row">
                                        <label for="email">Email</label>
                                        <input id="email" type="email" placeholder="Type email" required>
                                    </div>
                                    <div class="form-row">
                                        <label for="message">How can we help?</label>
                                        <textarea id="message" placeholder="Type message" required></textarea>
                                    </div>
                                    <div class="form-row">
                                        <button type="submit" class="btn">Send message</button>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </main>

                    <footer class="container">
                        <div class="row">
                            &copy; Copyrights 2020-2022 Oxo All rights reserved.
                        </div>
                    </footer>

                    <script src="./js/pages/home.js" type="module" defer></script>
                </body>

                </html>`;
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