import SocketIOGameBaseHistory from "../_base/SocketIOGameBaseHistory";
import { getStringDateByTime } from "./../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "./../../common/helpers/NumberHelper";
import SlotGameHistoryItem from "./SlotGameHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameHistory extends SocketIOGameBaseHistory {
    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    showTicketDetail(data: any) {}

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(SlotGameHistoryItem);
        let win = betLog.betWin;

        if (betLog.settlementResult.jackpot !== null) {
            win += betLog.settlementResult.jackpot.winningAmount;
            item.jackpotIcon.active = true;
        }

        item.node.active = true;
        item.bg.active = index % 2 > 0;
        item.time.string = getStringDateByTime(betLog.time);
        item.roundID.string = betLog.id;
        item.payLines.string = betLog.paylines.length;
        item.bet.string = numberWithCommas(betLog.bet);
        item.totalAmount.string = betLog.freeSpin ? "0" : numberWithCommas(betLog.totalAmount);
        item.win.string = numberWithCommas(win);
        item.data = betLog;

        const highlightColor = win <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

        item.time.node.color = highlightColor;
        item.payLines.node.color = highlightColor;
        item.bet.node.color = highlightColor;
        item.win.node.color = highlightColor;

        item.showTicketDetail = (log) => {
            this.showTicketDetail(log);
        };
        this.content.addChild(itemNode);
    }
}
