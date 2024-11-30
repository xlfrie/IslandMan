import { world } from "@minecraft/server";
import EventManager from "managers/EventManager";
import SystemIntervalManager from "managers/SystemIntervalManager";
import ChatHelper, { Colors } from "utils/ChatHelper";
import ControlBlockBreakProtection from "./events/ControlBlockBreakProtection";
import ControlBlockPlaceProtection from "./events/ControlBlockPlaceProtection";
import ParticleForcefield from "./intervals/ParticleForcefield";
import { UnitTestregister } from "./tests/UnitTestRegister";

world.afterEvents.worldInitialize.subscribe(() => {
	ChatHelper.broadcastMessage(Colors.GREEN + Colors.BOLD + "Loaded");
});

SystemIntervalManager.registerIntervals([new ParticleForcefield()]);
EventManager.registerEvents([
	new ControlBlockBreakProtection(),
	new ControlBlockPlaceProtection(),
]);

UnitTestregister.register();
