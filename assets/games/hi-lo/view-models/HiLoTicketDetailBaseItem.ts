import * as i18n from "i18n/runtime-scripts/LanguageData";

import { getStringHourByTime } from "../../../common/helpers/DateTimeHelper";
import HiLoTicketDetailItem from "./HiLoTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTicketDetailBaseItem extends HiLoTicketDetailItem {
    @property(cc.Label)
    round: cc.Label = null;

    setData(data: any, isFirst: boolean) {
        if (isFirst) {
            this.time.string = getStringHourByTime(data.time);
            this.round.string = `${i18n.t(`hiLo.startRound`)}`;
            this.stake.string = data.amount;
            this.win.string = "";
            this.stake.node.color = cc.Color.YELLOW;
        } else {
            this.time.string = getStringHourByTime(data.endTime);
            this.round.string = `${i18n.t(`hiLo.endRound`)}`;
            this.stake.string = "";
            this.win.string = data.betwin;
            this.win.node.color = cc.Color.YELLOW;
        }
    }
}
