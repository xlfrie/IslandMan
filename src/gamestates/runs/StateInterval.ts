import Interval from "types/Interval";
import { State } from "../GameStateManager";

export default interface StateInterval extends Interval {
	handlesState: State;
}
