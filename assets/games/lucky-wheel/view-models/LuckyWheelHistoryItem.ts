import * as i18n from "i18n/runtime-scripts/LanguageData";

import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckyWheelHistoryItem extends cc.Component {
    @property(cc.Label)
    id: cc.Label = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    result: cc.Label = null;

    updateData(data: any) {
        this.id.string = data.id;
        this.time.string = getStringDateByTime(data.time);

        if (data.result === 0) {
            this.result.string = GameUtils.getText(`ui.goodluck`);
        } else {
            this.result.string = `${data.result} Scoin`;
        }
    }
}
