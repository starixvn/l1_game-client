import * as i18n from "i18n/runtime-scripts/LanguageData";
import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import NewCard from "../../../common/new-card/view-models/NewCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlackJackHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    handId: cc.Label = null;

    @property(cc.Node)
    split: cc.Node = null;

    @property(cc.Node)
    dealerCards: cc.Node = null;

    @property(cc.Label)
    dealerResult: cc.Label = null;

    @property(cc.Node)
    playerCards: cc.Node = null;

    @property(cc.Label)
    playerResult: cc.Label = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    setData(log: any) {
        const isSplit = log.splitFrom || log.actions.includes("split");
        this.time.string = getStringDateByTime(log.time);
        this.time.node.color = log.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

        this.handId.string = log.id;
        this.handId.node.color = log.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

        this.split.active = isSplit;
        this.bet.string = numberWithCommas(log.bet);
        this.win.string = numberWithCommas(log.betwin);
        this.win.node.color = log.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
        // cards for dealer
        this.initCards(log.result, this.dealerCards);
        this.convertResult(this.dealerResult, log.settlementResult, log.result, isSplit);

        // cards for player
        this.initCards(log.cards, this.playerCards);
        this.convertResult(this.playerResult, log.total, log.cards, isSplit);
        this.playerResult.node.color = log.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
    }

    initCards(cards: any, cardsNode: cc.Node) {
        cards.forEach((playerCard) => {
            const node = cc.instantiate(this.cardPrefab);
            const cardComponent = node.getComponent(NewCard);

            cardComponent.setCard(playerCard);
            cardComponent.faceUp();
            node.scaleX = 0.23;
            node.scaleY = 0.255;
            cardsNode.addChild(node);
        });
    }

    convertResult(resultLabel: cc.Label, result: number, array: any, isSplit: boolean) {
        if (result > 21) {
            resultLabel.string = i18n.t(`ui.bust`);
        } else if (result === 21 && array.length === 2 && !isSplit) {
            resultLabel.string = "BJ";
        } else {
            resultLabel.string = result.toString();
        }
    }
}
