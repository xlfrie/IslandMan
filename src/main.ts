import { world } from "@minecraft/server";
import EventManager from "managers/EventManager";
import SystemIntervalManager from "managers/SystemIntervalManager";
import ControlBlockBreakProtection from "./events/ControlBlockBreakProtection";
import ControlBlockPlaceProtection from "./events/ControlBlockPlaceProtection";
import ParticleForcefield from "./intervals/ParticleForcefield";

world.afterEvents.worldInitialize.subscribe(() => {
	world.getDimension("overworld").runCommand("wsserver ws://localhost:8080");
});

SystemIntervalManager.registerIntervals([new ParticleForcefield()]);
EventManager.registerEvents([
	new ControlBlockBreakProtection(),
	new ControlBlockPlaceProtection(),
]);
