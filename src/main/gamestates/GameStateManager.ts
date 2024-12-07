import { world } from "@minecraft/server";
import ChatHelper, { Colors, LOG_LEVEL } from "lib/utils/ChatHelper";
import { gameStateManager } from "main";
import Gameplay from "./runs/gameplay/Gameplay";
import Intermission from "./runs/intermission/Intermission";
import StateHandler from "./runs/StateHandler";

export default class GameStateManager {
    public _states: Gamestate = {
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

            this.initState();
            return;
        }

        if (typeof states !== "string") throw new Error("Corrupted gamestate");

        ChatHelper.log(`Successfully loaded gamestate`);
        this._states = JSON.parse(states);

        this.initState();
    }

    get states() {
        return this._states;
    }

    public saveGameState() {
        world.setDynamicProperty(
            "islandman:GameState",
            JSON.stringify(this._states)
        );
    }

    public setStarted(started?: boolean) {
        this._states.started = started == undefined ? true : started;
        this.saveGameState();
    }

    public setQuota(quota: Quota) {
        this._states.quota = quota;
        this.saveGameState();
    }

    public setState(state: State) {
        if (state !== this._states.state) {
            this._states.state = state;
            this.saveGameState();
            this.initState();
        }
    }

    public initState() {
        ChatHelper.log(
            `Changing state handler to ${Colors.BOLD}${
                State[this._states.state]
            }`
        );

        this.stateHandler?.end();

        switch (gameStateManager._states.state) {
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
    quota: Quota;
}

export interface Quota {
    isActive: boolean;
    item: String | undefined;
    count: number | undefined;
    delivered: number | undefined;
}

export enum State {
    INTERMISSION,
    CUTSCENE,
    GAMEPLAY,
}
