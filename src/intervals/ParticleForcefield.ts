import {
	LocationInUnloadedChunkError,
	MolangVariableMap,
	system,
	world,
} from "@minecraft/server";
import Interval from "types/Interval";
import ChatHelper from "utils/ChatHelper";
import { Vector } from "wrappers/Vector";

export default class ParticleForcefield implements Interval {
	public name: string = "particle-cylinder";
	public delay: number = 1;
	private tickMax = 40;
	private cylinderHeight = 10;
	private radius = 15 / 2;
	private overworld = world.getDimension("overworld");
	private molangVarMap = new MolangVariableMap();
	private rotations = 5;
	private maxTheta = this.rotations * Math.PI * 2;
	private spiralCount = 2;

	constructor() {
		this.molangVarMap.setColorRGB("variable.color", {
			red: 0,
			green: 1,
			blue: 0,
		});
	}

	public execute = async () => {
		const tick = system.currentTick % this.tickMax;
		const thetaIncr = (1 / this.tickMax) * Math.PI * 2 * this.rotations;
		const lerps = 5;
		const lerpIncr = thetaIncr / lerps;

		for (let j = 0; j < this.spiralCount; j++) {
			for (let i = 0; i < lerps; i++) {
				let theta = thetaIncr * tick - lerpIncr * i;
				const offset = (1 / this.spiralCount) * j * Math.PI * 2;

				const loc = new Vector(
					Math.sin(theta + offset) * this.radius + 0.5,
					(j % 2 == 1
						? (theta / this.maxTheta) * this.cylinderHeight
						: this.cylinderHeight -
						  (theta / this.maxTheta) * this.cylinderHeight) -
						this.cylinderHeight / 2,
					Math.cos(theta + offset) * this.radius + 0.5
				);

				try {
					this.overworld.spawnParticle(
						"minecraft:colored_flame_particle",
						loc,
						this.molangVarMap
					);
				} catch (e) {
					if (e instanceof LocationInUnloadedChunkError) {
						ChatHelper.broadcastMessage("Hello");
					} else {
						throw e;
					}
				}
			}
		}

		return 0;
	};
}
