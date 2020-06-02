import BaseDataHandler from "./BaseDataHandler";
import DataHandler from "../../../../_base/handlers/DataHandler";
import ChanLeMain from "../ChanLeMain";
import { numberWithCommas } from '../../../../../common/helpers/Helper';

export default class BetStatusDataHandler extends BaseDataHandler implements DataHandler {
    constructor(main: ChanLeMain) {
        super(main)
    }

    handle(data: any): boolean {
        if (!data.status) {
            return false;
        }

        var self = this;

        this.main.currentStatus = data.status;

        // setTimeout(() => {
        //     if (!self.main.isNan) {
        //         self.showUserWinLossAnimation(data.status);
        //     }
        //     self.main.root.sendData({ get_new: true });
        // }, 2e3);

        return true;
    }



}