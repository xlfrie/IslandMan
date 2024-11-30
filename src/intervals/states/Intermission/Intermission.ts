import { State } from "../../../GameStateManager";
import StateInterval from "../StateInterval";

export default class Intermission implements StateInterval {
	public name: string = "intermission-state";
	public delay: number = 1;

	public handlesState: State = State.INTERMISSION;

	private firstTick = true;

	public execute = async () => {
		if (this.firstTick) {
			this.firstTick = false;
		}

		return 0;
	};
}
