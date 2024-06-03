const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const shortid = require("shortid");
const validUrl = require('valid-url');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var shortenUrls = {}; // :wow:

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = message.toString();
        if (validUrl.isUri(data)) {
            let id = shortid.generate();
            let found = false;

            for (let i in shortenUrls) {
                if (shortenUrls[i] == data) {
                    found = true;
                    id = i;
                    break;
                }
            }

            if (!found) {
                shortenUrls[id] = data;
            }

            ws.send(`/s/${id}`);
        } else {
            ws.send(`FAILED`);
        }
    });
});

app.get("/src/script.js", (req, res) => {
    res.sendFile(path.join(__dirname, "/src/script.js"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src/index.html"));
});

app.get("/s*", (req, res) => {
    const id = req.url.split("/")[2];
    if (shortenUrls[id]) {
        res.redirect(shortenUrls[id]);
    } else {
        res.send("Invaild URL");
    }
});

server.listen(3000, () => {
    console.log("Server is running");
});
