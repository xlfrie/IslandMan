import { world } from "@minecraft/server";
import Event from "types/Event";
import Interval from "types/Interval";
import ChatHelper from "utils/ChatHelper";
import { Vector } from "wrappers/Vector";
import { gameStateManager } from "../../../main";
import { MOB_EVENTS } from "../../../utils/MobEvents";
import { State } from "../../GameStateManager";
import StateHandler from "../StateHandler";
import QuotaActionbar from "./intervals/QuotaActionbar";

export default class Gameplay extends StateHandler {
	public state: State = State.GAMEPLAY;
	public events: Event[] = [];
	public intervals: Interval[] = [new QuotaActionbar()];

	public isFirstLoad: boolean = !gameStateManager.states.started;

	public islandManSpawn: Vector = new Vector(0.5, 1, 0.5);

	public override start() {
		super.start();

		if (this.isFirstLoad) {
			const states = gameStateManager.states;
			states.started = true;

			ChatHelper.log("Detected first load, preparing game");

			gameStateManager.states = states;
		}

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
