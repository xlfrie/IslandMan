import * as server from "@minecraft/server";

server.world.afterEvents.worldInitialize.subscribe(() => {
	server.world.sendMessage(`Hello, world!`);
});
