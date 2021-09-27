import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import KenoHistoryItem from "../KenoHistoryItem";
import KenoUserHistory from "./KenoUserHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoUserHistoryItem extends KenoHistoryItem {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property(cc.Label)
    total: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    public roundId: number;
    public totalResult: number;
    public result: number[];
    public settlementResult: any;
    private main: KenoUserHistory;

    public init(main: KenoUserHistory): void {
        this.main = main;
    }

    public showResult(): void {
        this.main.showRoundResult(this.roundId, this.totalResult, this.result, this.settlementResult);
    }

    onDisable() {
        this.main.hideRoundResult();
        this.node.destroy();
    }

    setData(betLog: any) {
        const { time, phien, result, betwin, settlementResult } = betLog;

        this.node.active = true;
        this.time.string = getStringDateByTime(time);
        this.roundId = phien;
        this.round.string = phien;
        this.win.string = numberWithCommas(betwin);
        this.win.node.color = betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

        let total = 0;
        result.forEach((resultItem) => {
            total += resultItem;
        });

        this.total.string = numberWithCommas(total);
        this.settlementResult = settlementResult;
        this.totalResult = total;
        this.result = result;
        this.setBasicData(betLog);
    }
}
