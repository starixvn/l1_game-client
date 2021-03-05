import MiniRoundHistoryTip from '../../../common/mini-round-history/MiniRoundHistoryTip';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigSmallRoundHistoryTip extends MiniRoundHistoryTip {
    public setData(data: any) {
        const point = data.result.dice1 + data.result.dice2 + data.result.dice3;
        this.roundId.string = `#${data.roundId}`;
        this.result.string = `${point < 11 ? "XỈU" : "TÀI"} (${data.result.dice1}-${data.result.dice2}-${data.result.dice3})`;
    }
}
