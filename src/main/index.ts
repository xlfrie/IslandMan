import { world } from "@minecraft/server";
import CommandManager from "lib/managers/CommandManager";
import EventManager from "lib/managers/EventManager";
import SystemIntervalManager from "lib/managers/SystemIntervalManager";
import ChatHelper, { Colors, LOG_LEVEL } from "lib/utils/ChatHelper";
import SetState from "./commands/SetState";
import ControlBlockBreakProtection from "./events/ControlBlockBreakProtection";
import ControlBlockPlaceProtection from "./events/ControlBlockPlaceProtection";
import GameStateManager from "./gamestates/GameStateManager";
import ParticleForcefield from "./intervals/ParticleForcefield";

let gameStateManager = new GameStateManager();

world.afterEvents.worldInitialize.subscribe(() => {
    ChatHelper.log(Colors.GREEN + Colors.BOLD + "Loaded", LOG_LEVEL.VERBOSE);
    gameStateManager.loadGameState();
});

CommandManager.setConfig({ prefix: ";" })
    .registerCommands([new SetState()])
    .init();
SystemIntervalManager.registerIntervals([new ParticleForcefield()]);
EventManager.registerEvents([
    new ControlBlockBreakProtection(),
    new ControlBlockPlaceProtection(),
]);

ChatHelper.setLogLevel(LOG_LEVEL.DEBUG);

export { gameStateManager };
