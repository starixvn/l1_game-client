
import GameBaseStatusHandler from "../../../_base/handlers/GameBaseStatusHandler";

export default class MiniKenoStatusHandler extends GameBaseStatusHandler {

    handle(data: any): boolean {
        //console.log(this.main.gameName);

        if (data.status) {
            this.currentStatusData = data.status;
            console.log(this.currentStatusData);
            // this.status(this.currentStatusData.win, this.currentStatusData.bet);
        }

        return true;
    }
}
