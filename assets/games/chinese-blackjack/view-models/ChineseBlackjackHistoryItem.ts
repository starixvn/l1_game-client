import GameUtils from "../../../common/GameUtils";
import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import { CardModel } from "../../../common/new-card/view-models/NewCard";
import BlackJackHistoryItem from "../../blackjack/view-models/BlackJackHistoryItem";
import ChineseBlackjackUtils from "./ChineseBlackjackUtils";

const { ccclass, property } = cc._decorator;

export interface IDataLog {
    id: number;
    pos: number;
    actions: string[];
    cards: CardModel[];
    total: number;
    softPoints: [];
    bet: number;
    betwin: number;
    freeBet: boolean;
    roundId: number;
    name: string;
    time: string;
    rate: number;
    result: CardModel[];
    settlementResult: number;
    ended: boolean;
}
@ccclass
export default class ChineseBlackjackHistoryItem extends BlackJackHistoryItem {
    @property({ type: cc.Node, override: true, visible: false })
    split: cc.Node = null;

    @property({ type: cc.Label, override: true, visible: false })
    round: cc.Label = null;

    setData(log: IDataLog, index: number) {
        if (!log) {
            return;
        }

        const { time, betwin, id, bet, cards, total, result, settlementResult, actions } = log;
        this.time.string = getStringDateByTime(time);
        this.time.node.color = betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
        this.handId.string = id.toString();
        this.handId.node.color = betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
        this.bet.string = numberWithCommas(bet);
        this.win.string = numberWithCommas(betwin, 2);
        this.setUICardsDealer(result, settlementResult, actions);
        this.setUICardsPlayer(cards, total, actions);
        this.playerResult.node.color = betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
        this.setBackground(index);
    }

    setUICardsDealer(result: CardModel[], settlementResult: number, actions: string[]) {
        this.initCards(result, this.dealerCards);
        this.setResult(this.dealerResult, settlementResult, result, actions);
    }

    setUICardsPlayer(cards: CardModel[], total: number, actions: string[]) {
        this.initCards(cards, this.playerCards);
        this.setResult(this.playerResult, total, cards, actions);
    }

    setResult(resultLabel: cc.Label, totalNumberCard: number, cards: CardModel[], actions: string[]) {
        if (!resultLabel) return;

        switch (true) {
            case totalNumberCard > 21:
                resultLabel.string = GameUtils.getText(`ChineseBlackjack.glossary_bust`);
                break;
            case ChineseBlackjackUtils.isBanBan(cards):
                resultLabel.string = GameUtils.getText(`ChineseBlackjack.glossary_hand_ranking_ban-ban`);
                break;
            case ChineseBlackjackUtils.isBanLuck(cards):
                resultLabel.string = GameUtils.getText(`ChineseBlackjack.glossary_hand_ranking_ban-luck`);
                break;
            case ChineseBlackjackUtils.isFiveCards(cards, totalNumberCard):
                resultLabel.string = GameUtils.getText(`ChineseBlackjack.glossary_five-card`);
                break;
            case ChineseBlackjackUtils.isUnqualified(cards, totalNumberCard) && ChineseBlackjackUtils.hasStandAction(actions):
                resultLabel.string = GameUtils.getText(`ChineseBlackjack.unqualified`);
                break;
            default:
                resultLabel.string = totalNumberCard.toString();
                break;
        }
    }
}
