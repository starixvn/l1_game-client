import { result } from 'lodash';

import { getStringDateByTime } from '../../../common/helpers/DateTimeHelper';
import { numberWithCommas } from '../../../common/helpers/NumberHelper';
import SocketIOGameHistoryBase from '../../_base/view-models/SocketIOGameHistoryBase';
import BigSmallHistoryItem from './BigSmallHistoryItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigSmallHistory extends SocketIOGameHistoryBase {
    @property(cc.Label)
    titleLabel: cc.Label = null;

    public gameTitle = "";
    private readonly historyTitle = "LỊCH SỬ";

    onLoad() {
        super.onLoad();
        this.titleLabel.string = `${this.historyTitle} ${this.gameTitle.toUpperCase()}`;
    }

    public handleBetHistory = (roundId) => {};

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(BigSmallHistoryItem);

        const { time, phien, betwin, amount, refund, win, choice, result } = betLog;
        item.time.string = getStringDateByTime(time);
        item.phien.string = phien;
        item.bet.string = numberWithCommas(amount);
        item.refund.string = numberWithCommas(refund);
        item.roundId = phien;
        item.win.string = numberWithCommas(betwin);
        item.choice.string = this.convertChoiceType(choice);
        item.result.string = `${result.dice1}-${result.dice2}-${result.dice3}  ${result.dice1 + result.dice2 + result.dice3}`;

        if (win) {
            item.win.node.color = cc.Color.YELLOW;
            item.time.node.color = cc.Color.YELLOW;
            item.choice.node.color = cc.Color.YELLOW;
        } else {
            item.win.node.color = cc.Color.WHITE;
            item.time.node.color = cc.Color.WHITE;
            item.choice.node.color = cc.Color.WHITE;
        }

        item.handleRoundIdClick = (roundId) => {
            this.openBetHistory(roundId);
        };

        this.content.addChild(itemNode);
    }

    openBetHistory(roundId: number) {
        this.handleBetHistory(roundId);
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
