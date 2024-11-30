import { ChatSendBeforeEvent } from "@minecraft/server";
import Command from "types/Command";
import ChatHelper from "utils/ChatHelper";
import { State } from "../gamestates/GameStateManager";
import { gameStateManager } from "../main";

export default class SetState implements Command {
	public name: string = "state";
	public execute = (event: ChatSendBeforeEvent) => {
		const args = event.message.split(" ");
		args.shift();
		const newState = parseInt(args[0]);

		if (newState !== undefined && newState >= 0 && newState <= 2) {
			const states = gameStateManager.states;
			states.state = newState;

			gameStateManager.states = states;
			ChatHelper.log(`Set state to ${State[newState].toString()}`);
		}

		return 0;
	};
}
