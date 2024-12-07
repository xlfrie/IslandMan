import { ChatSendBeforeEvent } from "@minecraft/server";
import Command from "lib/types/Command";
import ChatHelper from "lib/utils/ChatHelper";
import { gameStateManager } from "main";
import { State } from "main/gamestates/GameStateManager";

export default class SetState implements Command {
    public name: string = "state";
    public execute = (event: ChatSendBeforeEvent) => {
        const args = event.message.split(" ");
        args.shift();
        const newState = parseInt(args[0]);

        if (newState !== undefined && newState >= 0 && newState <= 2) {
            ChatHelper.log(`Setting state to ${State[newState].toString()}`);
            gameStateManager.setState(newState);
        } else {
            ChatHelper.log("Reset states");

            gameStateManager._states = {
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

            gameStateManager.saveGameState();
            gameStateManager.loadGameState();
        }
        return 0;
    };
}
