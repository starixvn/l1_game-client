import { formatDateTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import WinThreeCardsHistory, { BetLog } from "./WinThreeCardsHistory";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WinThreeCardsHistoryItem extends cc.Component {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    winLabel: cc.Label = null;

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    @property(cc.Node)
    bgRow: cc.Node = null;

    betLog: BetLog;
    historyMainNode: WinThreeCardsHistory = null;

    async setData(betLog: BetLog,  index: number) {
        this.bgRow.active = index % 2 === 1;
        const winColor = cc.Color.WHITE.fromHEX("#fff664");
        this.betLog = betLog;       
        this.timeLabel.string = formatDateTime(betLog.time);
        this.roundLabel.string = betLog.phien.toString();

        this.amountLabel.string = numberWithCommas(betLog.totalAmount, 2);
        this.winLabel.string = numberWithCommas(betLog.betwin, 2);
        this.winLabel.node.color = betLog.betwin > 0 ? winColor : cc.Color.WHITE;
    }
}
