import { world } from "@minecraft/server";
import { Vector } from "wrappers/Vector";
import { MOB_EVENTS } from "../../../utils/MobEvents";

export default class Gameplay {
	public islandManSpawn: Vector = new Vector(0.5, 1, 0.5);

	public setup() {
		const overworld = world.getDimension("overworld");

		// Ensure islandman is spawned

		const entities = overworld.getEntities({ type: "xlfrie:islandman" });

		for (const entity of entities) {
			entity.remove();
		}

		// Spawn *him* in
		const islandMan = overworld.spawnEntity(
			"xlfrie:islandman",
			this.islandManSpawn
		);

		islandMan.triggerEvent(MOB_EVENTS.GO_CENTER);
	}
}
