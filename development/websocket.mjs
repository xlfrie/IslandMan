import { v4 as uuid } from "uuid";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", () => {
    console.log("Connected");
});

const reload = () => {
    for (const client of wss.clients) {
        client.send(
            JSON.stringify({
                header: {
                    version: 1,
                    requestId: uuid(),
                    messagePurpose: "commandRequest",
                    messageType: "commandRequest",
                },
                body: {
                    commandLine: "reload",
                },
            })
        );
    }
};

export { reload };
