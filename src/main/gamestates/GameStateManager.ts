import { world } from "@minecraft/server";
import ChatHelper, { Colors, LOG_LEVEL } from "lib/utils/ChatHelper";
import { gameStateManager } from "main";
import Gameplay from "./runs/gameplay/Gameplay";
import Intermission from "./runs/intermission/Intermission";
import StateHandler from "./runs/StateHandler";

export default class GameStateManager {
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
    public stateHandler: StateHandler | undefined;

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

        if (this._states.state === gameStateManager.stateHandler?.state) return;

        gameStateManager.stateHandler?.end();

        ChatHelper.log(
            `Changing state handler to ${Colors.BOLD}${
                State[this._states.state]
            }`
        );

        switch (this._states.state) {
            case State.INTERMISSION:
                gameStateManager.stateHandler = new Intermission();
                break;
            case State.CUTSCENE:
                gameStateManager.stateHandler = undefined;
                break;
            case State.GAMEPLAY:
                gameStateManager.stateHandler = new Gameplay();
                break;
            default:
                ChatHelper.log("Unknown state");
                break;
        }

        gameStateManager.stateHandler?.start();
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
