import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import KenoHistoryItem from "../../../keno-pro/view-models/KenoHistoryItem";
import MiniKenoHistory from "./MiniKenoHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoHistoryItem extends KenoHistoryItem {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    total: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    public result: number[];
    public settlementResult: any;
    public betLogDetails: any[];

    private main: MiniKenoHistory;
    private readonly betChoices = ["even", "odd", "big", "small", "gold", "wood", "water", "fire", "earth"];

    init(main: MiniKenoHistory) {
        this.main = main;
    }

    onTotalClick() {
        this.main.kenoGameDropDownList.closeDropDown();
        this.main.showHistoryDetail(this.roundId.string, this.result, this.settlementResult, this.betLogDetails);
    }

    setData(betLog: any) {
        const { phien, betLogDetails, betwin, result, settlementResult } = betLog;

        this.node.active = true;
        this.result = result;
        this.settlementResult = settlementResult;
        this.betLogDetails = betLogDetails;
        this.time.string = getStringDateByTime(betLog.time);
        this.roundId.string = phien;

        this.betChoices.forEach((choice) => {
            this[choice].string = numberWithCommas(betLog[choice]);
        });

        const total = result.reduce((resultTotal: number, number: number) => resultTotal + number, 0);
        this.total.string = total;

        Object.keys(settlementResult).forEach((key) => {
            if (settlementResult[key]) {
                this[key].node.color = cc.Color.YELLOW;
            }
        });
        this.win.string = numberWithCommas(betwin);
        this.win.node.color = betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
    }
}
