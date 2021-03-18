import { getStringDateByTime } from '../../../common/helpers/DateTimeHelper';
import { numberWithCommas } from '../../../common/helpers/NumberHelper';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigSmallHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    phien: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    result: cc.Label = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Label)
    refund: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    roundId = 0;

    public handleRoundIdClick = (roundId: number) => {};

    openBetHistory() {
        this.handleRoundIdClick(this.roundId);
    }

    setData(betLog, index) {
        const { time, phien, betwin, amount, refund, win, choice, result } = betLog;
        this.time.string = getStringDateByTime(time);
        this.phien.string = phien;
        this.bet.string = numberWithCommas(amount);
        this.refund.string = numberWithCommas(refund);
        this.roundId = phien;
        this.win.string = numberWithCommas(betwin);
        this.choice.string = this.convertChoiceType(choice);
        this.result.string = `${result.dice1}-${result.dice2}-${result.dice3}  ${result.dice1 + result.dice2 + result.dice3}`;

        if (win) {
            this.win.node.color = cc.Color.YELLOW;
            this.time.node.color = cc.Color.YELLOW;
            this.choice.node.color = cc.Color.YELLOW;
        } else {
            this.win.node.color = cc.Color.WHITE;
            this.time.node.color = cc.Color.WHITE;
            this.choice.node.color = cc.Color.WHITE;
        }
    }

    convertChoiceType(choice: string): string {
        let betChoice = "";

        switch (choice) {
            case "big":
                betChoice = "Tài";
                break;
            case "small":
                betChoice = "Xỉu";
                break;
            case "even":
                betChoice = "Chẵn";
                break;
            case "odd":
                betChoice = "Lẻ";
                break;
            default:
                break;
        }
        return betChoice;
    }
}
