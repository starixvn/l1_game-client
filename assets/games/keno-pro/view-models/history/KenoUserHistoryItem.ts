import GameHistoryItemBase from "../../../_base/GameHistoryItemBase";
import KenoUserHistory from "./KenoUserHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoUserHistoryItem extends GameHistoryItemBase {
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
}
