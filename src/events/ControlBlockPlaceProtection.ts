import { PlayerPlaceBlockBeforeEvent, world } from "@minecraft/server";
import Event from "types/Event";
import { Vector } from "wrappers/Vector";

export default class ControlBlockPlaceProtection implements Event {
	public name: string = "control-block-place-protection";
	public eventSignal = world.beforeEvents.playerPlaceBlock;
	public execute = (event: PlayerPlaceBlockBeforeEvent) => {
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
