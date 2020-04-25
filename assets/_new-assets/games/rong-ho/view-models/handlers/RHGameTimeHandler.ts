import RongHo from "../RongHo";
import DataHandler from "../../../../common/_base/view-models/DataHandler";

export default class RHGameTimeHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        if (data.time) {
            this.main.currentTimeRemaining = data.time - 1;
            this.main.umNotice.node.active = false;
            this.main.playTime();
            return true;
        }
    }
}
