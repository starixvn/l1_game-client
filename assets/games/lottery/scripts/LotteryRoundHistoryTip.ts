import GameUtils from "../../../common/GameUtils";
import MiniRoundHistoryTip from "../../../common/mini-round-history/MiniRoundHistoryTip";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryRoundHistoryTip extends MiniRoundHistoryTip {
    type = 0;

    public setData(data: any) {
        this.roundId.string = `#${data.roundId}`;

        let resultString = "";
        if (this.type === 0) {
            if (data.settlementResult.others.big) {
                resultString = `${GameUtils.getBetChoiceString("big")}`;
            } else {
                resultString = `${GameUtils.getBetChoiceString("small")}`;
            }
        } else {
            if (data.settlementResult.others.even) {
                resultString = `${GameUtils.getBetChoiceString("even")}`;
            } else {
                resultString = `${GameUtils.getBetChoiceString("odd")}`;
            }
        }

        const special = data.result.special[0].slice(-2);
        this.result.string = `${resultString} (${special})`;
    }
}
