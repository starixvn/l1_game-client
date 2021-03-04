import MiniRoundHistoryTip from '../../../common/mini-round-history/MiniRoundHistoryTip';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigSmallRoundHistoryTip extends MiniRoundHistoryTip {
    public setData(data: any) {
        var point = data.dice[0] + data.dice[1] + data.dice[2];
        this.roundId.string = `#${data.phien}`;
        this.result.string = `${point < 11 ? "XỈU" : "TÀI"} (${data.dice[0]}-${data.dice[1]}-${data.dice[2]})`;
    }
}
