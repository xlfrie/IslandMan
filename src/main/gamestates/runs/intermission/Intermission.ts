import { Player, PlayerSpawnAfterEvent, world } from "@minecraft/server";
import Event from "lib/types/Event";
import Interval from "lib/types/Interval";
import { Vector } from "lib/wrappers/Vector";
import { State } from "main/gamestates/GameStateManager";
import StateHandler from "../StateHandler";
import Actionbar from "./intervals/Actionbar";

export default class Intermission extends StateHandler {
    public state: State = State.INTERMISSION;
    public events: Event[] = [];

    public intervals: Interval[] = [new Actionbar()];

    public override playerInit(
        playerOrEvent: Player | PlayerSpawnAfterEvent
    ): Player | void {
        const player = super.playerInit(playerOrEvent);
        if (!player) return;

        // TODO save locations and restore if game has already started
        if (!player.hasTag("dev")) {
            player.onScreenDisplay.hideAllExcept();
            player.teleport(new Vector(0.5, -63, 0.5));
            player.addEffect("blindness", 20000000, { showParticles: false });
        }
    }

    public override end() {
        for (const player of world.getAllPlayers()) {
            player.removeEffect("blindness");
            player.onScreenDisplay.resetHudElements();
        }

        super.end();
    }
}
