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

            const states = gameStateManager.states;

            states.state = newState;
            gameStateManager.states = states;
        } else {
            ChatHelper.log("Reset states");

            gameStateManager.states = {
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
        }

        return 0;
    };
}
