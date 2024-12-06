import { world } from "@minecraft/server";
import Interval from "lib/types/Interval";
import { gameStateManager } from "main";
import { Quota } from "main/gamestates/GameStateManager";
import Assert from "main/utils/Assert";

export default class QuotaActionbar implements Interval {
    public name: string = "gameplay-actionbar";
    public delay: number = 20;

    private itemPool: string[] = ["minecraft:wheat", "minecraft:oak_log"];

    private filledUnit: string = "|||";
    private fillerUnit: string = "-";
    private endCaps: string[] = ["[", "]"];
    private barLength: number = 20;

    constructor() {
        if (!gameStateManager.states.quota.isActive) this.activateQuota();
    }

    public execute = async () => {
        if (!gameStateManager.states.quota.isActive) return 0;
        let bar: string = "";

        Assert.assertIsNumber(gameStateManager.states.quota.delivered);
        Assert.assertIsNumber(gameStateManager.states.quota.count);

        const deliveredPercent =
            gameStateManager.states.quota.delivered /
            gameStateManager.states.quota.count;

        for (let i = 0; i < this.barLength; i++) {
            if ((i + 1) / this.barLength <= deliveredPercent) {
                bar += this.filledUnit;
            } else {
                bar += this.fillerUnit;
            }
        }

        // TODO make percent change color based on satisfaction

        let text = `${Math.round(deliveredPercent * 100 * 10) / 10}% ${
            this.endCaps[0]
        }${bar}${this.endCaps[1]} ${
            Math.round(deliveredPercent * 100 * 10) / 10
        }%`;

        for (const player of world.getAllPlayers()) {
            player.onScreenDisplay.setActionBar(text);
        }

        gameStateManager.states.quota.delivered++;
        gameStateManager.states.quota.delivered =
            gameStateManager.states.quota.delivered %
            (gameStateManager.states.quota.count + 1);

        return 0;
    };

    private activateQuota() {
        // TODO add a system to check if they've unlocked the crop yet
        // TODO make quota scale with player count
        // TODO make quota count scale with their production rates.

        const quota: Quota = {
            item: this.itemPool[
                Math.round(Math.random() * (this.itemPool.length - 1))
            ],
            count: Math.round(Math.random() * 50),
            delivered: 0,
            isActive: true,
        };

        gameStateManager.setQuota(quota);
    }
}
