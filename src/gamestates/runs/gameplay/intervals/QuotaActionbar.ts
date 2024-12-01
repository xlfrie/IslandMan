import Interval from "types/Interval";
import { gameStateManager } from "../../../../main";

export default class QuotaActionbar implements Interval {
	public name: string = "gameplay-actionbar";
	public delay: number = 1;

	private itemPool: String[] = ["minecraft:wheat", "minecraft:oak_log"];

	constructor() {
		if (!gameStateManager.states.quota.isActive) this.activateQuota();
	}

	public execute = async () => {
		return 0;
	};

	private activateQuota() {
		// TODO add a system to check if they've unlocked the crop yet
		// TODO make quota scale with player count
		// TODO make quota count scale with their production rates.

		const states = gameStateManager.states;

		states.quota.item =
			this.itemPool[
				Math.round(Math.random() * (this.itemPool.length - 1))
			];
		states.quota.count = Math.round(Math.random() * 50);

		states.quota.delivered = 0;

		states.quota.isActive = true;

		gameStateManager.states = states;
	}
}
