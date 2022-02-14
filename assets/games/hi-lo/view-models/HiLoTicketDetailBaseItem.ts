import { getStringHourByTime } from "../../../common/helpers/DateTimeHelper";
import HiLoTicketDetailItem from "./HiLoTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTicketDetailBaseItem extends HiLoTicketDetailItem {
    @property(cc.Label)
    round: cc.Label = null;

    setData(data: any, isFirst: boolean) {
        this.time.string = isFirst ? getStringHourByTime(data.time) : getStringHourByTime(data.endTime);
        this.round.string = isFirst ? "Start Round" : "End Round";
        this.stake.string = isFirst ? data.amount : "";
        this.win.string = isFirst ? "" : data.betwin;
    }
}
