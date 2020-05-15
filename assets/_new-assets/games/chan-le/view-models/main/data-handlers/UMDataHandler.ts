import DataHandler from "../../../../_base/handlers/DataHandler";
import BaseDataHandler from "./BaseDataHandler";
import ChanLeMain from "../ChanLeMain";
export default class UMDataHandler extends BaseDataHandler implements DataHandler {

    constructor(main: ChanLeMain) {
        super(main);
    }

    handle(data: any): boolean {
        if (!data.um) {
            return false;
        }

        if (this.main.currentTimeRemaining == this.main.root.gameConfigs.betTime
            || data.time_remain == this.main.root.gameConfigs.fullTime) {
            this.main.isDisabled = true;
            this.main.noticeUM.show(data);
            this.main.onGameHide();

            return true;
        }
    }
}
