
import GameBaseStatusHandler from "../../../_base/handlers/GameBaseStatusHandler";

export default class MiniKenoStatusHandler extends GameBaseStatusHandler {

    handle(data: any): boolean {

        if (data.status) {
            this.currentStatusData = data.status;
            // this.status(this.currentStatusData.win, this.currentStatusData.bet);
        }

        return true;
    }
}
