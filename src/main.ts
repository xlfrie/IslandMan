import { world } from "@minecraft/server";
import SystemIntervalManager from "managers/SystemIntervalManager";
import ParticleCylinder from "./intervals/ParticleCylinder";

world.afterEvents.worldInitialize.subscribe(() => {
	world.getDimension("overworld").runCommand("wsserver ws://localhost:8080");
});

SystemIntervalManager.registerIntervals([new ParticleCylinder()]);
