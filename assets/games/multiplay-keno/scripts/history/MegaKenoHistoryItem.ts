import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import MultiplayGameHistoryItem from "../../../multiplay/scripts/MultiplayGameHistoryItem";
import MegaKenoHistory from "./MegaKenoHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MegaKenoHistoryItem extends MultiplayGameHistoryItem {
    @property(cc.Label)
    big: cc.Label = null;

    @property(cc.Label)
    small: cc.Label = null;

    @property(cc.Label)
    odd: cc.Label = null;

    @property(cc.Label)
    even: cc.Label = null;

    @property(cc.Label)
    gold: cc.Label = null;

    @property(cc.Label)
    wood: cc.Label = null;

    @property(cc.Label)
    water: cc.Label = null;

    @property(cc.Label)
    fire: cc.Label = null;

    @property(cc.Label)
    earth: cc.Label = null;

    @property(cc.Label)
    total: cc.Label = null;

    public result: number[];
    public settlementResult: any;
    public betLogDetails: any[];

    private main: MegaKenoHistory;
    private readonly betChoices = ["even", "odd", "big", "small", "gold", "wood", "water", "fire", "earth"];

    init(main: MegaKenoHistory) {
        this.main = main;
    }

    onTotalClick() {
        this.main.dropdownList.closeDropDown();
        this.main.showHistoryDetail(this.round.string, this.result, this.settlementResult);
    }

    setData(betLog: any, index) {
        super.setData(betLog, index);

        const { phien, betLogDetails, betwin, result, settlementResult } = betLog;

        this.node.active = true;
        this.result = result;
        this.settlementResult = settlementResult;
        this.betLogDetails = betLogDetails;
        this.time.string = getStringDateByTime(betLog.time);
        this.round.string = phien;

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
        this.win.string = numberWithCommas(betwin, 2);
        this.win.node.color = betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
    }
}
