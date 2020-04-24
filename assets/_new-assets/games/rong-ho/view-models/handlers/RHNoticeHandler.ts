import RongHo from "../RongHo";
import DataHandler from "../../../../common/_base/view-models/DataHandler";


export default class RHNoticeHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        if (data.notice) {
            this.main.addNotice(data.notice);
            this.main.waitingCuoc = false;
        }
        return true;
    }
}
