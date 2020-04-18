import ChanLeMain from "../ChanLeMain";
import DataHandler from "../../../../../common/_base/view-models/DataHandler";
import BaseDataHandler from "./BaseDataHandler";
export default class UMDataHandler extends BaseDataHandler implements DataHandler {

    constructor(main: ChanLeMain) {
        super(main);
    }

    handle(data: any) {
        if (!data.um) {
            return;
        }
        if (this.main.currentTimeRemaining == this.main.root.gameConfigs.betTime
            || data.time_remain == this.main.root.gameConfigs.fullTime) {
            this.main.isDisabled = true;
            this.main.noticeUM.active = true;
            this.main.onGameHide();
        }
    }
}
