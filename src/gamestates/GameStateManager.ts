import { world } from "@minecraft/server";
import ChatHelper, { Colors, LOG_LEVEL } from "utils/ChatHelper";
import Gameplay from "./runs/gameplay/Gameplay";
import Intermission from "./runs/intermission/Intermission";
import StateHandler from "./runs/StateHandler";

export class GameStateManager {
	private _states: Gamestate = {
		started: false,
		state: State.INTERMISSION,
		producedCount: {},
		quota: {
			isActive: false,
			item: undefined,
			count: undefined,

			delivered: undefined,
		},
	};
	private stateHandler: StateHandler | undefined;

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

		if (this._states.state === this.stateHandler?.state) return;

		this.stateHandler?.end();
		this.stateHandler = undefined;

		ChatHelper.log(
			`Changing state handler to ${Colors.BOLD}${
				State[this._states.state]
			}`
		);

		switch (this._states.state) {
			case State.INTERMISSION:
				this.stateHandler = new Intermission();
				break;
			case State.CUTSCENE:
				break;
			case State.GAMEPLAY:
				this.stateHandler = new Gameplay();
				break;
			default:
				ChatHelper.log("Unknown state");
				break;
		}

		this.stateHandler?.start();
	}
}

export interface Gamestate {
	started: boolean;
	state: State;
	producedCount: {
		[key: string]: number;
	};
	quota: {
		isActive: boolean;
		item: String | undefined;
		count: number | undefined;
		delivered: number | undefined;
	};
}

export enum State {
	INTERMISSION,
	CUTSCENE,
	GAMEPLAY,
}
