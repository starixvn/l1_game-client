import RongHo from "../RongHo";
import DataHandler from "../../../_base/handlers/DataHandler";


export default class RHNoticeHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        if (data.notice) {
            this.main.addNotice(data.notice);
            this.main.waitingCuoc = false;
            this.main.showWarningSlowBet(false);
        }
        return true;
    }
}
