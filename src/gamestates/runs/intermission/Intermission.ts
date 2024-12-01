import { Player } from "@minecraft/server";
import Event from "types/Event";
import Interval from "types/Interval";
import { State } from "../../GameStateManager";
import StateHandler from "../StateHandler";
import IntermissionActionBar from "./intervals/IntermissionActionBar";

export default class Intermission extends StateHandler {
	public override state: State = State.INTERMISSION;
	public override events: Event[] = [];

	public override intervals: Interval[] = [new IntermissionActionBar()];

	public override playerInit(player: Player): void {
		throw new Error("Method not implemented.");
	}
}
