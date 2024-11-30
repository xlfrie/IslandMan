import { world } from "@minecraft/server";
import EventManager from "managers/EventManager";
import SystemIntervalManager from "managers/SystemIntervalManager";
import ChatHelper, { Colors, LOG_LEVEL } from "utils/ChatHelper";
import ControlBlockBreakProtection from "./events/ControlBlockBreakProtection";
import ControlBlockPlaceProtection from "./events/ControlBlockPlaceProtection";
import { GameStateManager } from "./GameStateManager";
import ParticleForcefield from "./intervals/ParticleForcefield";
import { UnitTestRegister } from "./tests/UnitTestRegister";

world.afterEvents.worldInitialize.subscribe(() => {
	ChatHelper.log(Colors.GREEN + Colors.BOLD + "Loaded", LOG_LEVEL.VERBOSE);
	GameStateManager.loadGameState();
});

SystemIntervalManager.registerIntervals([new ParticleForcefield()]);
EventManager.registerEvents([
	new ControlBlockBreakProtection(),
	new ControlBlockPlaceProtection(),
]);

UnitTestRegister.register();
ChatHelper.setLogLevel(LOG_LEVEL.DEBUG);
