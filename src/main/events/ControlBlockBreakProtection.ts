import { PlayerBreakBlockBeforeEvent, world } from "@minecraft/server";
import Event from "lib/types/Event";
import { Vector } from "lib/wrappers/Vector";

export default class ControlBlockBreakProtection implements Event {
    public name: string = "control-block-break-protection";
    public eventSignal = world.beforeEvents.playerBreakBlock;
    public execute = (event: PlayerBreakBlockBeforeEvent) => {
        const loc = new Vector(event.block.location);
        const radius = 15 / 2;
        const cylinderHeight = 10;

        if (
            loc.x ** 2 + loc.z ** 2 <= radius ** 2 &&
            loc.y >= -cylinderHeight / 2 &&
            loc.y <= cylinderHeight / 2
        )
            event.cancel = true;

        return 0;
    };
}
