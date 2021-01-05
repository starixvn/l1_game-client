import MiniKenoHistory from "./MiniKenoHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    total: cc.Label = null;

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
