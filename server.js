import createRammerhead from 'rammerhead/src/server/index.js';
import { createBareServer } from '@tomphttp/bare-server-node';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import config from './config.json' assert { type: 'json' };
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { baremuxPath } from '@mercuryworkshop/bare-mux';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import wisp from 'wisp-server-node';
import express from 'express';
import http from 'http';


const bare = createBareServer('/bare/');
const rh = createRammerhead();

const rammerheadScopes = [
  '/rammerhead.js',
  '/hammerhead.js',
  '/transport-worker.js',
  '/task.js',
  '/iframe-task.js',
  '/worker-hammerhead.js',
  '/messaging',
  '/sessionexists',
  '/deletesession',
  '/newsession',
  '/editsession',
  '/needpassword',
  '/syncLocalStorage',
  '/api/shuffleDict',
  '/mainport'
];

const rammerheadSession = /^\/[a-z0-9]{32}/;

function shouldRouteRh(req) {
  const url = new URL(req.url, 'http://0.0.0.0');
  return (
    rammerheadScopes.includes(url.pathname) ||
    rammerheadSession.test(url.pathname)
  );
}

function routeRhRequest(req, res) {
  rh.emit('request', req, res);
}

function routeRhUpgrade(req, socket, head) {
  rh.emit('upgrade', req, socket, head);
}

const server = http.createServer((req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else if (shouldRouteRh(req)) {
        routeRhRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else if (shouldRouteRh(req)) {
        routeRhUpgrade(req, socket, head);
    } else if (req.url.endsWith('/wisp/')) {
        wisp.routeRequest(req, socket, head);
    }
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/uv/', express.static(uvPath));
app.use('/epoxy/', express.static(epoxyPath));
app.use('/baremux/', express.static(baremuxPath));

app.use((req, res, next) => {
    res.status(404);
    res.sendFile('public/pages/error/404.html', { root: dirname(fileURLToPath(import.meta.url)) });
});

function readSsl(key, cert) {
    readFileSync(key);
    readFileSync(cert);
};

let port = config.port;

if (config.ssl === true) {
    readSsl(config.ssl_opt.key, config.ssl_opt.cert);
};

server.on('listening', () => {
    console.log(`Server listening on port: ${port}`);
});
server.listen(port);