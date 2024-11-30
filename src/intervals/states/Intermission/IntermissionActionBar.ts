import { system, world } from "@minecraft/server";
import { Colors } from "utils/ChatHelper";
import { State } from "../../../GameStateManager";
import StateInterval from "../StateInterval";

export default class ActionBar implements StateInterval {
	public name: string = "intermission-actionbar";
	public delay: number = 5;

	public handlesState: State = State.INTERMISSION;
	private wheel = ["\\^v^/", "/^v^\\"];

	public execute = async () => {
		if (system.currentTick % this.delay === 0) {
			let string = "INTERMISSION";

			const wheelIndex =
				(system.currentTick / this.delay) % this.wheel.length;
			const stringIndex =
				(system.currentTick / this.delay) % (string.length + 8);

			if (stringIndex < string.length) {
				let buff = [...string];
				buff[stringIndex] = buff[stringIndex].toLowerCase();

				string = buff.join("");
			}

			for (const player of world.getAllPlayers()) {
				player.onScreenDisplay.setActionBar(
					`${Colors.BOLD}${this.wheel[wheelIndex]} ${
						Colors.GREEN
					}${string}${Colors.RESET} ${Colors.BOLD}${
						this.wheel[this.wheel.length - 1 - wheelIndex]
					}`
				);

				player.onScreenDisplay.hideAllExcept;
			}
		}
		return 0;
	};
}
