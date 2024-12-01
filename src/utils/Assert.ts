import ChatHelper, { LOG_LEVEL } from "utils/ChatHelper";

export default class Assert {
	public static assertIsNumber(arg: any): asserts arg is number {
		if (typeof arg !== "number") {
			ChatHelper.log("Type number assertion failed", LOG_LEVEL.ERROR);
		}
	}
}
