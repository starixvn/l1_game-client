import GameUtils from "../../../common/GameUtils";
import NoticeUtil from "../../../common/utils/NoticeUtil";
import GameBaseNoticeHandler from "../../_base/handlers/GameBaseNoticeHandler";
import SlotGameBase from "../SlotGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameBaseNoticeHandler extends GameBaseNoticeHandler {
    constructor(protected readonly main: SlotGameBase) {
        super(main);
    }

    handle(data: any): boolean {
        if (!data.notice) {
            return false;
        }

        const { errorCode } = data.notice;

        if (errorCode === "SB1929") {
            this.main.setTotalFreeSpins(0);
            this.main.updateDisplaySpinButtons();
            this.main.spinButton.showNormalMode();
        }

        const text = NoticeUtil.getLocalizedErrorMessage(errorCode, {});
        if (text) {
            this.main.showMiniWarning(text);
        }
    }
}
