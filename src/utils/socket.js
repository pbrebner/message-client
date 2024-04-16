import { io } from "socket.io-client";

const socket = io.connect("https://message-api.fly.dev");

socket.on("connect_error", (error) => {
    if (socket.active) {
        // temporary failure, the socket will automatically try to reconnect
    } else {
        // the connection was denied by the server
        // in that case, `socket.connect()` must be manually called in order to reconnect
        console.log(error.message);
    }
});

export { socket };
