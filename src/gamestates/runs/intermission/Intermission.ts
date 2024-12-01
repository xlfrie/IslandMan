import { Player, PlayerSpawnAfterEvent, world } from "@minecraft/server";
import Event from "types/Event";
import Interval from "types/Interval";
import { Vector } from "wrappers/Vector";
import { State } from "../../GameStateManager";
import StateHandler from "../StateHandler";
import IntermissionActionbar from "./intervals/IntermissionActionBar";

export default class Intermission extends StateHandler {
	public state: State = State.INTERMISSION;
	public events: Event[] = [];

	public intervals: Interval[] = [new IntermissionActionbar()];

	public override playerInit(
		playerOrEvent: Player | PlayerSpawnAfterEvent
	): Player | void {
		const player = super.playerInit(playerOrEvent);
		if (!player) return;

		// TODO save locations and restore if game has already started
		if (!player.hasTag("dev")) {
			player.onScreenDisplay.hideAllExcept();
			player.teleport(new Vector(0.5, -63, 0.5));
			player.addEffect("blindness", 20000000, { showParticles: false });
		}
	}

	public override end() {
		for (const player of world.getAllPlayers()) {
			player.removeEffect("blindness");
			player.onScreenDisplay.resetHudElements();
		}

		super.end();
	}
}
