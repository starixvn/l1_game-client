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

    init(main: MiniKenoHistory) {
        this.main = main;
    }

    onTotalClick() {
        this.main.kenoGameDropDownList.closeDropDown();
        this.main.showHistoryDetail(this.roundId.string, this.result, this.settlementResult, this.betLogDetails);
    }
}
