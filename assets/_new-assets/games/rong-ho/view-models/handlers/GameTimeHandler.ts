import RongHo from "../RongHo";
import DataHandler from "../../../../common/_base/view-models/DataHandler";

export default class GameTimeHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        if (data.time_remain) {
            this.main.currentTimeRemaining = data.time_remain;
            this.main.umNotice.node.active = false;
            this.main.playTime();
            return true;
        }
    }
}
