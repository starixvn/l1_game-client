import { GameBaseStatusHandler } from "../../../_base/handlers/GameBaseStatusHandler";

export default class MiniKenoStatusHandler extends GameBaseStatusHandler {
    handle(data: any): boolean {
        if (data.status) {
            this.currentStatusData = data.status;
        }

        return true;
    }
}
