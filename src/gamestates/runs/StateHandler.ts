import { Player, system } from "@minecraft/server";
import EventManager from "managers/EventManager";
import SystemIntervalManager from "managers/SystemIntervalManager";
import Event from "types/Event";
import Interval from "types/Interval";
import { State } from "../GameStateManager";

export default abstract class StateHandler {
	public abstract state: State;

	public abstract events: Event[];
	public abstract intervals: Interval[];

	private runIDs: number[] = [];

	public start() {
		this.runIDs = this.runIDs.concat(
			SystemIntervalManager.registerIntervals(this.intervals),
			EventManager.registerEvents(this.events)
		);
	}

	public end() {
		for (const id of this.runIDs) {
			system.clearRun(id);
		}
	}

	public abstract playerInit(player: Player): void;
}
