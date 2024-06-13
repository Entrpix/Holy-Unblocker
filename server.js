import createRammerhead from "rammerhead/src/server/index.js";
import { createBareServer } from "@tomphttp/bare-server-node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { baremuxPath } from "@mercuryworkshop/bare-mux";
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import wisp from "wisp-server-node";
import { hostname } from "node:os";
import express from "express";
import http from 'http';

const bare = createBareServer("/bare/");
const rh = createRammerhead();

const rammerheadScopes = [
  "/rammerhead.js",
  "/hammerhead.js",
  "/transport-worker.js",
  "/task.js",
  "/iframe-task.js",
  "/worker-hammerhead.js",
  "/messaging",
  "/sessionexists",
  "/deletesession",
  "/newsession",
  "/editsession",
  "/needpassword",
  "/syncLocalStorage",
  "/api/shuffleDict",
  "/mainport"
];

const rammerheadSession = /^\/[a-z0-9]{32}/;

function shouldRouteRh(req) {
  const url = new URL(req.url, "http://0.0.0.0");
  return (
    rammerheadScopes.includes(url.pathname) ||
    rammerheadSession.test(url.pathname)
  );
}

function routeRhRequest(req, res) {
  rh.emit("request", req, res);
}

function routeRhUpgrade(req, socket, head) {
  rh.emit("upgrade", req, socket, head);
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
    } else if (req.url.endsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head);
    }
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

app.use((req, res, next) => {
    res.status(404);
    res.sendFile("public/pages/error/404.html", { root: dirname(fileURLToPath(import.meta.url)) });
});

const port = 3000;

server.on("listening", () => {
    const address = server.address();

    console.log("Listening on:");
    console.log(`\thttp://localhost:${address.port}`);
    console.log(`\thttp://${hostname()}:${address.port}`);
    console.log(
        `\thttp://${address.family === "IPv6" ? `[${address.address}]` : address.address
        }:${address.port}`
    );
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close();
    process.exit(0);
}

server.listen(port);