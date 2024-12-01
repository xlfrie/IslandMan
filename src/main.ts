import { world } from "@minecraft/server";
import CommandManager from "managers/CommandManager";
import EventManager from "managers/EventManager";
import SystemIntervalManager from "managers/SystemIntervalManager";
import ChatHelper, { Colors, LOG_LEVEL } from "utils/ChatHelper";
import SetState from "./commands/SetState";
import ControlBlockBreakProtection from "./events/ControlBlockBreakProtection";
import ControlBlockPlaceProtection from "./events/ControlBlockPlaceProtection";
import { GameStateManager } from "./gamestates/GameStateManager";
import ParticleForcefield from "./intervals/ParticleForcefield";
import { UnitTestRegister } from "./tests/UnitTestRegister";

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

UnitTestRegister.register();
ChatHelper.setLogLevel(LOG_LEVEL.VERBOSE);

export { gameStateManager };
