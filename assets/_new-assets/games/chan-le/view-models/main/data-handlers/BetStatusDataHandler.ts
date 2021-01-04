import DataHandler from "../../../../_base/handlers/DataHandler";
import ChanLeMain from "../ChanLeMain";
import BaseDataHandler from "./BaseDataHandler";

export default class BetStatusDataHandler extends BaseDataHandler implements DataHandler {
    constructor(main: ChanLeMain) {
        super(main);
    }

    handle(data: any): boolean {
        if (!data.status) {
            return false;
        }

        this.main.currentStatus = data.status;

        return true;
    }
}
