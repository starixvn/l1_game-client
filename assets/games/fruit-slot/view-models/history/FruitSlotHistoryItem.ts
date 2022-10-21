import { formatDateTime } from "../../../../common/helpers/DateTimeHelper";
import FruitSlotHistory, { BetLog } from "./FruitSlotHistory";
import FruitSlotTicketDetail from "./FruitSlotTicketDetail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotHistoryItem extends cc.Component {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property({ type: cc.Sprite })
    symbol: cc.Sprite = null;

    @property(cc.Label)
    bigSmallValueLabel: cc.Label = null;

    @property(cc.Node)
    bigSymbol: cc.Node = null;

    @property(cc.Node)
    smallSymbol: cc.Node = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    winLabel: cc.Label = null;

    @property(cc.SpriteFrame)
    symbolSprites: cc.SpriteFrame[] = [];

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    betLog: BetLog;
    historyMainNode: FruitSlotHistory = null;

    openTicketDetail() {
        const { betLogDetails, odds, settlementResult } = this.betLog;

        const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
        this.historyMainNode.ticketDetailContent.addChild(ticketDetailPrefab);

        const ticketDetailComponent = ticketDetailPrefab.getComponent(FruitSlotTicketDetail);
        ticketDetailComponent.setData(betLogDetails, settlementResult);
        ticketDetailComponent.showbetLogs(this.symbolSprites, odds, this.betLog);
    }

    async setData(betLog: BetLog, historyMainNode: FruitSlotHistory) {
        this.betLog = betLog;
        this.historyMainNode = historyMainNode;
        this.timeLabel.string = formatDateTime(betLog.time);
        this.roundLabel.string = betLog.phien.toString();

        const matched = (sprite: cc.SpriteFrame, symbol: string) => sprite.name === symbol;
        const symbolName = betLog.result.isLucky ? "lucky" : betLog.result.symbols[0];
        this.symbol.spriteFrame = this.symbolSprites.find((sprite) => matched(sprite, `item_${symbolName}`));

        this.bigSmallValueLabel.string = betLog.result.number.toString();
        const isBigSymbol = betLog.result.number > 7;
        this.bigSymbol.active = isBigSymbol;
        this.smallSymbol.active = !isBigSymbol;

        this.amountLabel.string = betLog.totalAmount.toString();
        this.winLabel.string = betLog.betwin.toString();
        this.winLabel.node.color = betLog.betwin > 0 ? cc.Color.YELLOW : cc.Color.WHITE;
    }
}
