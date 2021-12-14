import * as i18n from "i18n/runtime-scripts/LanguageData";

import { getStringDateByTime, getStringHourByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import { convertCard } from "../../components/cards/view-models/CardWrapper";
import HoldemPokerCard, { CardModel } from "../../components/cards/view-models/HoldemPokerCard";
import { CombineCardResultLabel } from "../../components/cards/view-models/HoldemPokerCards";
import { HoldemPokerChoicesConst } from "../../event-models/HoldemPokerChoices";
import { HoldemPokerTicketDetailModel } from "../../event-models/HoldemPokerTicketDetailModel";
import HoldemPokerTicketDetailItem from "./HoldemPokerTicketDetailItem";
import { HandResultConst } from "./HoldemPokerTicketHistory";

const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Games/HolemPoker/HoldemPokerTicketHistory")
export default class HoldemPokerTicketDetail extends cc.Component {
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
    dealerRank: cc.Label = null;

    @property(cc.Sprite)
    betTable: cc.Sprite = null;

    private heightBetTable: number = 64;

    renderTitle(roundId: number, time: Date) {
        this.roundId.string = roundId.toString();
        this.time.string = getStringDateByTime(time);
        this.roundId.node.color = cc.Color.YELLOW;
    }

    renderBets(data: HoldemPokerTicketDetailModel) {
        const { bets } = data.ticketDetail;
        let index = 0;
        bets.forEach(bet => {
            this.heightBetTable += 60;
            const odds = bet.odds ? bet.odds : "-";
            this.initItem(bet.betChoice, bet.stake, bet.win, bet.time, odds, index % 2 !== 0);
            index++;
        });
        this.betTable.node.height = this.heightBetTable;

    }

    initItem(betOption: string, stake: number, win: number, time: string, odd: string, showBg: boolean) {
        const detailItemPrefab = cc.instantiate(this.prefabItem);
        const item = detailItemPrefab.getComponent(HoldemPokerTicketDetailItem);
        this.content.addChild(detailItemPrefab);

        const bettingOption = `holdEmPoker.${betOption}`;
        item.bettingOption.string = `${i18n.t(bettingOption)}`;
        item.stake.string = numberWithCommas(stake);
        item.win.string = numberWithCommas(win);
        item.time.string = getStringHourByTime(time);
        item.odd.string = odd;
        item.bgRow.active = showBg;
        item.win.node.color = win <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
    }

    renderCards(data: HoldemPokerTicketDetailModel) {
        const { playerCards, dealerCards, isFold, communityCards, isPlayerWin } = data.ticketDetail;
        const playerCardsConverted = convertCard(playerCards.cards);
        const communityCardsConverted = convertCard(communityCards);

        playerCardsConverted.forEach((element) => {
            this.playerCardsContainer.node.addChild(this.createCard(element, 0.75, 0.75));
            this.playerCardsContainer.updateLayout();
        });

        communityCardsConverted.forEach((element) => {
            this.communityCardsContainer.node.addChild(this.createCard(element, 0.75, 0.75));
            this.communityCardsContainer.updateLayout();
        });

        if (!isFold) {
            let dealerResult: string;
            const playerCombinationConverted = convertCard(playerCards.combinationCards);
            const dealerCombinationConverted = convertCard(dealerCards.combinationCards);
            const dealerCardsConverted = convertCard(dealerCards.cards);

            this.renderCardsUIEqualCall(playerCombinationConverted, dealerCombinationConverted, dealerCardsConverted);

            const playerResult = `holdEmPoker.${CombineCardResultLabel[playerCards.handResultId].dataId}`;
            this.playerRank.string = `${i18n.t(playerResult)}`;

            if (dealerCards.isQualified) {
                dealerResult = `holdEmPoker.${CombineCardResultLabel[dealerCards.handResultId].dataId}`;

                if (isPlayerWin >= 0) {
                    this.playerRank.node.color = cc.Color.YELLOW;
                } else {
                    this.dealerRank.node.color = cc.Color.YELLOW;
                }
            } else {
                this.playerRank.node.color = cc.Color.YELLOW;
                dealerResult = `holdEmPoker.${HandResultConst[0]}`;
            }
            this.dealerRank.string = `${i18n.t(dealerResult)}`;
        } else {
            this.renderCardsUIEqualFold();
        }
    }

    private renderCardsUIEqualCall(playerCombination: any, dealerCombination: any, dealerCards: any) {
        playerCombination.forEach((element) => {
            this.playerCombinationContainer.node.addChild(this.createCard(element, 0.75, 0.75));
            this.playerCombinationContainer.updateLayout();
        });

        dealerCombination.forEach((element) => {
            this.dealerCombinationContainer.node.addChild(this.createCard(element, 0.75, 0.75));
            this.dealerCombinationContainer.updateLayout();
        });

        dealerCards.forEach((element) => {
            this.dealerCardsContainer.node.addChild(this.createCard(element, 0.75, 0.75));
            this.dealerCardsContainer.updateLayout();
        });
    }

    private renderCardsUIEqualFold() {
        const dealerFakeData = [
            { rank: "1", suit: 1 },
            { rank: "1", suit: 1 }
        ];
        dealerFakeData.forEach((element) => {
            this.dealerCardsContainer.node.addChild(this.createCard(element, 0.75, 0.75, false));
            this.dealerCardsContainer.updateLayout();
        });
        this.dealerCombinationContainer.getComponent(cc.Label).string = "-";
        this.playerCombinationContainer.getComponent(cc.Label).string = "-";
        const playerResult = 'holdEmPoker.fold';
        this.playerRank.string = `${i18n.t(playerResult)}`;
        this.dealerRank.string = "-";
    }

    // private getTotalBetWin(bets) {
    //     return Object.keys(bets.result).reduce((sum, current) => {
    //         return sum + bets.result[current];
    //     }, 0);
    // }

    private createCard(card: CardModel, scaleX: number, scaleY: number, isFaceUp = true): cc.Node {
        const node = cc.instantiate(this.pokerCardPrefab);
        const cardComponent = node.getComponent(HoldemPokerCard);
        cardComponent.setCard(card);
        cardComponent.setFaceUp(isFaceUp);
        node.scaleX = scaleX;
        node.scaleY = scaleY;
        return node;
    }

    onDisable() {
        this.content.destroyAllChildren();
        this.node.destroy();
    }
}
