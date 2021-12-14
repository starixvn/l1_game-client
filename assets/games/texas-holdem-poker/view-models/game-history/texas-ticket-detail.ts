import * as i18n from "i18n/runtime-scripts/LanguageData";

import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { TexasHoldemPokerTicketDetailModel } from "../../event-models/texas-holdem-poker-ticket-detail-model";
import TexasHoldemPokerCard, { CardModel } from "../../texas-cards-component/view-models/texas-holdem-poker-card";
import TexasTicketDetailItem, { TicketDetailItem } from "./texas-ticket-detail-item";

const { ccclass, property, menu } = cc._decorator;
const convertOldRank = (num: number): string => {
    num++;
    const dict = {
        11: "J",
        12: "Q",
        13: "K",
        1: "A"
    };
    return dict[num] || num.toString();
};
const convertOldSuit = (num: number): string => {
    num++;
    const dict = {
        4: "D",
        3: "C",
        2: "B",
        1: "A"
    };
    return dict[num];
};
export const convertCard = (cards) => {
    return cards.map((e) => {
        return {
            rank: convertOldRank(e.rank),
            suit: convertOldSuit(e.suit)
        };
    });
};

export class BetLog {
    total: number;
    ante: number;
    river: number;
    call: number;
    turn: number;
    result: any;
}
@ccclass
export default class TexasTicketDetail extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Prefab)
    pokerCardPrefab: cc.Prefab = null;

    @property(cc.Layout)
    playerCardsContainer: cc.Layout = null;

    @property(cc.Layout)
    dealerCardsContainer: cc.Layout = null;

    @property(cc.Layout)
    communityCardsContainer: cc.Layout = null;

    @property(cc.Layout)
    playerCombinationContainer: cc.Layout = null;

    @property(cc.Layout)
    dealerCombinationContainer: cc.Layout = null;

    @property(cc.Label)
    playerRank: cc.Label = null;

    @property(cc.Label)
    communityFold: cc.Label = null;

    @property(cc.Label)
    dealerRank: cc.Label = null;

    private betOption = {
        ante: i18n.t("texasPoker.ante"),
        call: i18n.t("texasPoker.call"),
        river: i18n.t("texasPoker.river"),
        turn: i18n.t("texasPoker.turn"),
        total: i18n.t("texasPoker.total")
    };

    renderTitle(roundId: number, time: Date) {
        this.roundId.string = roundId.toString();
        this.time.string = getStringDateByTime(time);
        this.roundId.node.color = cc.Color.YELLOW;
    }

    renderBets(data: any) {
        const { bets, isFold } = data.ticketDetail;
        const betLog = new BetLog();
        betLog.ante = bets.ante;
        betLog.call = bets.call;
        betLog.turn = bets.turn;
        betLog.river = bets.river;
        betLog.total = bets.bet;
        betLog.result = bets.result;
        this.showBetLogs(betLog, isFold);
    }

    public showBetLogs(betLog: BetLog, isFold: boolean) {
        this.node.active = true;
        const totalBetWin = this.getTotalBetWin(betLog);
        const betResults = Object.entries(betLog)
            .map(([key, value]) => {
                return {
                    bettingOption: key,
                    stake: value,
                    win: key === "total" ? totalBetWin : betLog.result[key]
                };
            })
            .filter((betResult) => betResult.bettingOption !== "result");

        if (isFold) {
            const newBetResults = betResults.filter((e) => e.stake > 0);
            newBetResults.forEach((data) => this.initTicketDetailItem(data));
        } else betResults.forEach((data) => this.initTicketDetailItem(data));
    }

    private initTicketDetailItem(data: { bettingOption: string; stake: number; win: number }) {
        const item = cc.instantiate(this.prefabItem);
        const itemComponent = item.getComponent(TexasTicketDetailItem);
        const detailItem: TicketDetailItem = {
            bettingOption: this.betOption[data.bettingOption],
            stake: data.stake,
            win: data.win,
            color: data.win > 0 ? cc.Color.YELLOW : cc.Color.WHITE
        };

        itemComponent.render(detailItem);
        this.content.addChild(item);
    }

    renderCards(data: TexasHoldemPokerTicketDetailModel, handRanking) {
        const { player, dealer, isFold, communityCards, isPlayerWin } = data.ticketDetail;

        const playerCards = convertCard(player.cards);
        playerCards.forEach((element) => {
            this.playerCardsContainer.node.addChild(this.createCard(element, 1.22, 1.2));
            this.playerCardsContainer.updateLayout();
        });

        if (!isFold) {
            const communityCardsConvert = convertCard(communityCards);
            const combinationPlayer = convertCard(player.combination);
            const combinationDealer = convertCard(dealer.combination);
            const dealerCards = convertCard(dealer.cards);

            communityCardsConvert.forEach((element) => {
                this.communityCardsContainer.node.addChild(this.createCard(element, 1.25, 1.2));
                this.communityCardsContainer.updateLayout();
            });

            this.renderCardsUIEqualCall(combinationPlayer, combinationDealer, dealerCards);
            this.playerRank.string = handRanking[player.handId];

            this.dealerRank.string = handRanking[dealer.handId];

            if (isPlayerWin >= 0) {
                this.playerRank.node.color = cc.Color.YELLOW;
            } else {
                this.dealerRank.node.color = cc.Color.YELLOW;
            }
        } else {
            this.renderCardsUIEqualFold();
        }
    }

    private renderCardsUIEqualCall(playerCombination: any, dealerCombination: any, dealerCards: any) {
        playerCombination.forEach((element) => {
            this.playerCombinationContainer.node.addChild(this.createCard(element, 1.25, 1.2));
            this.playerCombinationContainer.updateLayout();
        });

        dealerCombination.forEach((element) => {
            this.dealerCombinationContainer.node.addChild(this.createCard(element, 1.25, 1.2));
            this.dealerCombinationContainer.updateLayout();
        });

        dealerCards.forEach((element) => {
            this.dealerCardsContainer.node.addChild(this.createCard(element, 1.25, 1.2));
            this.dealerCardsContainer.updateLayout();
        });
    }

    private renderCardsUIEqualFold() {
        const dealerFakeData = [
            { rank: "1", suit: "A" },
            { rank: "1", suit: "B" }
        ];
        dealerFakeData.forEach((element) => {
            this.dealerCardsContainer.node.addChild(this.createCard(element, 1.25, 1.2, false));
            this.dealerCardsContainer.updateLayout();
        });
        this.dealerCombinationContainer.getComponent(cc.Label).string = "-";
        this.playerCombinationContainer.getComponent(cc.Label).string = "-";
        this.communityFold.string = "-";
        this.playerRank.string = i18n.t("texasPoker.fold");
        this.dealerRank.string = "-";
    }

    private getTotalBetWin(bets) {
        return Object.keys(bets.result).reduce((sum, current) => {
            return sum + bets.result[current];
        }, 0);
    }

    private createCard(card: CardModel, scaleX: number, scaleY: number, isFaceUp = true): cc.Node {
        const node = cc.instantiate(this.pokerCardPrefab);
        const cardComponent = node.getComponent(TexasHoldemPokerCard);
        cardComponent.setCard(card);
        cardComponent.setCardHistory(isFaceUp);
        node.scaleX = scaleX;
        node.scaleY = scaleY;
        return node;
    }

    onDisable() {
        this.content.destroyAllChildren();
        this.node.destroy();
    }
}
