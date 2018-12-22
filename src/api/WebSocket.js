//-----------------------------------------------------------------------------
//	WebSocket
//-----------------------------------------------------------------------------
export default function CreateWebSocket(url, request, onReady, onMessage, onError, onClose) {
    let webSocket = new WebSocket(url);
    webSocket.onopen = function() {
        console.log("onopen");
        webSocket.send(JSON.stringify(request));
        console.log(request);
    }
    webSocket.onmessage = function(event) {
        var obj = JSON.parse(event.data);
        if(obj.MsgType === "KEEP_ALIVE")
            return;
        if(obj.MsgType === "READY") {
            console.log("ready");
            if(onReady) {
                onReady(obj);
            }
            return;
        }
        if(onMessage) {
            onMessage(obj);
        }
    }
    webSocket.onerror = function (error) {
        console.log('WebSocket Error ' + error);
        if(onError) {
            onError(error);
        }
    }
    webSocket.onclose = function(event) {
        console.log("onclose");
        if(onClose) {
            onClose(event);
        }
    }
    return webSocket;
}
