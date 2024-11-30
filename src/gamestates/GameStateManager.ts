import { system, world } from "@minecraft/server";
import SystemIntervalManager from "managers/SystemIntervalManager";
import ChatHelper, { LOG_LEVEL } from "utils/ChatHelper";
import Gameplay from "./runs/gameplay/Gameplay";
import Intermission from "./runs/intermission/Intermission";
import IntermissionActionBar from "./runs/intermission/intervals/IntermissionActionBar";

export class GameStateManager {
	private _states: Gamestate = { started: false, state: State.INTERMISSION };
	private registeredIntervals: number[] = [];

	public loadGameState() {
		const states = world.getDynamicProperty("islandman:GameState");

		if (states === undefined) {
			ChatHelper.log(
				"Gamestate was unset, setting defaults",
				LOG_LEVEL.WARN
			);
			this.saveGameState();
			return;
		}

		if (typeof states !== "string") throw new Error("Corrupted gamestate");

		ChatHelper.log(`Successfully loaded gamestate`);
		this.states = JSON.parse(states);
	}

	private saveGameState() {
		world.setDynamicProperty(
			"islandman:GameState",
			JSON.stringify(this._states)
		);
	}

	get states(): Gamestate {
		return this._states;
	}

	set states(state) {
		ChatHelper.log(
			`Gamestate change, new data ${JSON.stringify(state)}`,
			LOG_LEVEL.DEBUG
		);
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
				new Intermission().setup();
				intervals = SystemIntervalManager.registerIntervals([
					new IntermissionActionBar(),
				]);
				break;
			case State.CUTSCENE:
				break;
			case State.GAMEPLAY:
				new Gameplay().setup();
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

export interface Gamestate {
	started: boolean;
	state: State;
}

export enum State {
	INTERMISSION,
	CUTSCENE,
	GAMEPLAY,
}
