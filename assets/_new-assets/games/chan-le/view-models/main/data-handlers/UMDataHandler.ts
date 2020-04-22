import ChanLeMain from "../ChanLeMain";
import DataHandler from "../../../../../common/_base/view-models/DataHandler";
import BaseDataHandler from "./BaseDataHandler";
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
            if (data.um_message) {
                let text = this.main.noticeUM.children[0];
                if (text) {
                    let label = text.getComponent(cc.Label);
                    label.string = data.um_message;
                }
            }
            this.main.noticeUM.active = true;
            this.main.onGameHide();

            return true;
        }
    }
}
