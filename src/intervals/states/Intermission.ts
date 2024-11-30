import { State } from "../../GameStateManager";
import StateInterval from "./StateInterval";

export default class Intermission implements StateInterval {
	public name: string = "intermission-state";
	public delay: number = 1;

	public handlesState: State = State.INTERMISSION;

	public execute = async () => {
		// ChatHelper.log(":Yo", LOG_LEVEL.DEBUG);
		return 0;
	};
}
