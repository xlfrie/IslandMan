import { world } from "@minecraft/server";
import Interval from "lib/types/Interval";
import { Colors } from "lib/utils/ChatHelper";

export default class Actionbar implements Interval {
    public name: string = "intermission-actionbar";
    public delay: number = 5;

    private wheel = ["\\^v^/", "/^v^\\"];
    private iteration: number = 0;

    public execute = async () => {
        let string = "INTERMISSION";

        const wheelIndex = this.iteration % this.wheel.length;
        const stringIndex = this.iteration % (string.length + 8);

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
        }

        this.iteration++;

        return 0;
    };
}
