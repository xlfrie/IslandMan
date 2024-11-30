import { world } from "@minecraft/server";
import ChatHelper, { LOG_LEVEL } from "utils/ChatHelper";

export class GameStateManager {
	private static state: GameState;

	public static loadGameState() {
		const state = world.getDynamicProperty("islandman:GameState");

		if (state === undefined) {
			ChatHelper.log(
				"Gamestate was unset, setting defaults",
				LOG_LEVEL.WARN
			);
			this.state = { started: false };
			this.saveGameState();
			return;
		}

		if (typeof state !== "string") throw new Error("Corrupted gamestate");

		ChatHelper.log(
			`Successfully loaded gamestate: ${state}`,
			LOG_LEVEL.DEBUG
		);
		this.state = JSON.parse(state);
	}

	private static saveGameState() {
		world.setDynamicProperty(
			"islandman:GameState",
			JSON.stringify(this.state)
		);
	}

	get state(): GameState {
		return this.state;
	}

	set state(state) {
		this.state = state;
		ChatHelper.broadcastMessage("Gamestate change");
	}
}

export interface GameState {
	started: boolean;
}
