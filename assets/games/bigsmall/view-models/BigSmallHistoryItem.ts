import GameUtils from "../../../common/GameUtils";
import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import SocketIOHistoryItemBase from "../../_base/view-models/SocketIOHistoryItemBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigSmallHistoryItem extends SocketIOHistoryItemBase {
    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    result: cc.Label = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Label)
    refund: cc.Label = null;

    roundId = 0;

    public handleRoundIdClick = (roundId: number) => {};

    openBetHistory() {
        this.handleRoundIdClick(this.roundId);
    }

    setData(betLog: any, index: number) {
        const { time, phien, betwin, amount, refund, win, choice, result } = betLog;
        this.time.string = getStringDateByTime(time);
        this.round.string = phien;
        this.bet.string = numberWithCommas(amount);
        this.refund.string = numberWithCommas(refund, 2);
        this.roundId = phien;
        this.win.string = numberWithCommas(betwin, 2);
        this.choice.string = GameUtils.getBetChoiceString(choice);
        this.result.string = `${result.dice1}-${result.dice2}-${result.dice3}  ${result.dice1 + result.dice2 + result.dice3}`;
        this.setBackground(index);

        if (win) {
            this.time.node.color = cc.Color.YELLOW;
            this.choice.node.color = cc.Color.YELLOW;
        } else {
            this.time.node.color = cc.Color.WHITE;
            this.choice.node.color = cc.Color.WHITE;
        }
    }
}
