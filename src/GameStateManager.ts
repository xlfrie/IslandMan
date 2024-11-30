import { system, world } from "@minecraft/server";
import SystemIntervalManager from "managers/SystemIntervalManager";
import ChatHelper, { LOG_LEVEL } from "utils/ChatHelper";
import Intermission from "./intervals/states/Intermission";

export class GameStateManager {
	private _states: GameState = { started: false, state: State.INTERMISSION };
	private registeredIntervals: number[] = [];

	public loadGameState() {
		const state = world.getDynamicProperty("islandman:GameState");

		if (state === undefined) {
			ChatHelper.log(
				"Gamestate was unset, setting defaults",
				LOG_LEVEL.WARN
			);
			this.saveGameState();
			return;
		}

		if (typeof state !== "string") throw new Error("Corrupted gamestate");

		ChatHelper.log(
			`Successfully loaded gamestate: ${state}`,
			LOG_LEVEL.DEBUG
		);
		this.states = JSON.parse(state);
	}

	private saveGameState() {
		world.setDynamicProperty(
			"islandman:GameState",
			JSON.stringify(this._states)
		);
	}

	get states(): GameState {
		return this._states;
	}

	set states(state) {
		ChatHelper.log("Gamestate change", LOG_LEVEL.DEBUG);
		this._states = state;
		this.onChange();
	}

	private onChange() {
		this.saveGameState();

		for (const id of this.registeredIntervals) {
			system.clearRun(id);
		}

		let intervals: number[] = [];

		switch (this._states.state) {
			case State.INTERMISSION:
				intervals = SystemIntervalManager.registerIntervals([
					new Intermission(),
				]);
				break;
			case State.CUTSCENE:
				break;
			case State.GAMEPLAY:
				break;
			default:
				ChatHelper.log("Unknown state");
				break;
		}

		for (const id of intervals) {
			this.registeredIntervals.push(id);
		}
	}
}

export interface GameState {
	started: boolean;
	state: State;
}

export enum State {
	INTERMISSION,
	CUTSCENE,
	GAMEPLAY,
}
