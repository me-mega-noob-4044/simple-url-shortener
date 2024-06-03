var socket = new WebSocket("ws://" + window.location.host + "/");

document.getElementById("shortenUrl").onclick = function() {
    if (socket.readyState !== 1) return;
    socket.send(document.getElementById("urlInput").value);
};

socket.onmessage = (message) => {
    let shortUrl = message.data.toString();
    if (shortUrl === "FAILED") {
        document.getElementById("result").style.color = "#f00";
        document.getElementById("result").innerHTML = "Invaild URL Input";
        return;
    }
    document.getElementById("result").style.color = "#0f0";
    document.getElementById("result").innerHTML = `${window.location.host.includes("localhost") ? "" : "https://"}${window.location.host}${shortUrl}`;
};
