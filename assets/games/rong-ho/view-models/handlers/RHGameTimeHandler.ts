import DataHandler from "../../../_base/handlers/DataHandler";
import RongHo from "../RongHo";

export default class RHGameTimeHandler implements DataHandler {
    constructor(private readonly main: RongHo) {}

    handle(data: any): boolean {
        if (data.time_remain) {
            this.main.currentTimeRemaining = data.time_remain - 1;
            this.main.disabledGame = false;
            this.main.umNotice.node.active = false;
            if (cc.RedT.GAME_IS_SHOWED) {
                this.main.playTime();
            }
        }

        return true;
    }
}
