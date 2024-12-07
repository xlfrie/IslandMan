import {
    Player,
    PlayerSpawnAfterEvent,
    system,
    world,
} from "@minecraft/server";
import EventManager from "lib/managers/EventManager";
import SystemIntervalManager from "lib/managers/SystemIntervalManager";
import Event from "lib/types/Event";
import Interval from "lib/types/Interval";
import { State } from "../GameStateManager";

export default abstract class StateHandler {
    public abstract state: State;

    public abstract events: Event[];
    public abstract intervals: Interval[];

    private runIDs: number[] = [];

    public start() {
        this.runIDs = this.runIDs.concat(
            SystemIntervalManager.registerIntervals(this.intervals)
        );

        EventManager.registerEvents(this.events);

        world.afterEvents.playerSpawn.subscribe(this.playerInit);

        for (const player of world.getAllPlayers()) {
            this.playerInit(player);
        }
    }

    public end() {
        for (const id of this.runIDs) {
            system.clearRun(id);
        }

        for (const event of this.events) {
            event.eventSignal.unsubscribe(event.execute);
        }

        world.afterEvents.playerSpawn.unsubscribe(this.playerJoin);
    }

    public playerJoin(event: PlayerSpawnAfterEvent) {
        console.log(event.player.name);
        if (event.initialSpawn) this.playerInit(event.player);
    }

    playerInit(event: Player | PlayerSpawnAfterEvent): Player | void;

    public playerInit(
        playerOrEvent: Player | PlayerSpawnAfterEvent
    ): Player | void {
        if ("initialSpawn" in playerOrEvent) {
            if (playerOrEvent.initialSpawn) {
                return playerOrEvent.player;
            }
        } else {
            return playerOrEvent;
        }
    }
}
