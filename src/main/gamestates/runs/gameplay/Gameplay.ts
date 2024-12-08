import { LocationInUnloadedChunkError, system, world } from "@minecraft/server";
import Event from "lib/types/Event";
import Interval from "lib/types/Interval";
import ChatHelper from "lib/utils/ChatHelper";
import { Vector } from "lib/wrappers/Vector";
import { gameStateManager } from "main";
import { State } from "main/gamestates/GameStateManager";
import { MOB_EVENTS } from "main/utils/MobEvents";
import StateHandler from "../StateHandler";
import QuotaActionbar from "./intervals/QuotaActionbar";

export default class Gameplay extends StateHandler {
    public state: State = State.GAMEPLAY;
    public events: Event[] = [];
    public intervals: Interval[] = [new QuotaActionbar()];

    public isFirstLoad: boolean = !gameStateManager.states.started;

    public islandManSpawn: Vector = new Vector(0.5, 1, 0.5);

    public override start() {
        if (this.isFirstLoad) {
            ChatHelper.log("Detected first load, preparing game");

            gameStateManager.setStarted();

            this.gameSetup();
        }

        let i = 1;

        const runid = system.runInterval(() => {
            console.log("Trying to spawn island man. Attempt " + i);

            try {
                this.spawnIslandMan();

                system.clearRun(runid);
            } catch (e) {
                if (!(e instanceof LocationInUnloadedChunkError)) {
                    throw e;
                }
            } finally {
                i++;
            }
        }, 20);

        super.start();
    }

    private spawnIslandMan() {
        const overworld = world.getDimension("overworld");

        // Ensure islandman is spawned

        const entities = overworld.getEntities({ type: "xlfrie:islandman" });

        for (const entity of entities) {
            entity.remove();
        }

        // Spawn *him* in
        const islandMan = overworld.spawnEntity(
            "xlfrie:islandman",
            this.islandManSpawn
        );

        islandMan.triggerEvent(MOB_EVENTS.GO_CENTER);
    }

    private gameSetup() {
        world.setTimeOfDay(0);
        world.setAbsoluteTime(0);
    }
}
