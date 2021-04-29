import MiniRoundHistoryTip from '../../../common/mini-round-history/MiniRoundHistoryTip';

const { ccclass } = cc._decorator;

@ccclass
export default class BigSmallRoundHistoryTip extends MiniRoundHistoryTip {
    protected readonly betTypes = ["big", "small"];
    protected readonly betTypesText = ["TÀI", "XỈU"];

    public setData(data: any) {
        this.roundId.string = `#${data.roundId}`;
        this.result.string = `${data.settlementResult[this.betTypes[0]] ? this.betTypesText[0] : this.betTypesText[1]} (${
            data.result.dice1
        }-${data.result.dice2}-${data.result.dice3})`;
    }
}
