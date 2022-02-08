import * as i18n from "i18n/runtime-scripts/LanguageData";
import HoldemPokerArrows from "../../../holdem-poker/components/cards/view-models/HoldemPokerArrows";
import HoldemPokerHandPlace from "../../../holdem-poker/components/cards/view-models/HoldemPokerHandPlace";

import { CardAnimation } from "../../event-models/texas-holdem-poker-constant";
import { CardModel } from "../../../../common/new-card/view-models/NewCard";
import HoldemPokerCard from "../../../holdem-poker/components/cards/view-models/HoldemPokerCard";
import AudioManager from "../../../../common/audio/AudioManager";

const { ccclass, property } = cc._decorator;

export const CombineCardResultLabel = [
    { key: 0, dataId: "doesNotQualify" },
    { key: 1, dataId: "highCards" },
    { key: 2, dataId: "onePair" },
    { key: 3, dataId: "twoPairs" },
    { key: 4, dataId: "threeKind" },
    { key: 5, dataId: "straight" },
    { key: 6, dataId: "flush" },
    { key: 7, dataId: "fullHouse" },
    { key: 8, dataId: "fourOfAKind" },
    { key: 9, dataId: "straightFlush" },
    { key: 10, dataId: "royalFlush" }
];

@ccclass
export default class TexasHoldemPokerCards extends cc.Component {
    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    cardBox: cc.Node = null;

    @property(HoldemPokerHandPlace)
    dealerCards: HoldemPokerHandPlace = null;

    @property(HoldemPokerHandPlace)
    middleCards: HoldemPokerHandPlace = null;

    @property(HoldemPokerHandPlace)
    playerCards: HoldemPokerHandPlace = null;

    @property(cc.Node)
    combineDealerCardResult: cc.Node = null;

    @property(cc.Node)
    combinePlayerCardResult: cc.Node = null;

    @property(cc.Node)
    cardDropPlace: cc.Node = null;

    @property(cc.AudioSource)
    cardSlideAudioSource: cc.AudioSource = null;

    protected handRanking = {
        1: i18n.t("texasPoker.highCard"),
        2: i18n.t("texasPoker.pair"),
        3: i18n.t("texasPoker.twoPairs"),
        4: i18n.t("texasPoker.threeKind"),
        5: i18n.t("texasPoker.straight"),
        6: i18n.t("texasPoker.flush"),
        7: i18n.t("texasPoker.fullHouse"),
        8: i18n.t("texasPoker.fourKind"),
        9: i18n.t("texasPoker.straightFlush"),
        10: i18n.t("texasPoker.royalFlush")
    };

    get isCollectedCard() {
        return (
            this.middleCards.getCards().length == 0 && this.playerCards.getCards().length == 0 && this.dealerCards.getCards().length == 0
        );
    }

    private playAudioCardSliding() {
        AudioManager.getInstance().playSFX(this.cardSlideAudioSource.clip);
    }

    private createCard(card: CardModel, scaleX: number, scaleY: number): cc.Node {
        const node = cc.instantiate(this.cardPrefab);
        const cardComponent = node.getComponent(HoldemPokerCard);
        cardComponent.setCardOldStyle(card);
        node.scaleX = scaleX;
        node.scaleY = scaleY;
        return node;
    }

    public drawingRejoinDealerCards(cardData: CardModel, faceDown: boolean) {
        this.dealCardWithoutAnimation(cardData, this.dealerCards, faceDown);
    }

    public drawingRejoinPlayerCards(cardData: CardModel, faceDown: boolean) {
        this.dealCardWithoutAnimation(cardData, this.playerCards, faceDown);
    }

    public focusPlayerCard() {
        this.playerCards.Selected = true;
    }

    public unFocusPlayerCard() {
        this.playerCards.Selected = false;
    }

    public drawingRejoinMiddleCards(cardData: CardModel, faceDown: boolean, forcePositionIndex?: number) {
        this.dealCardWithoutAnimation(cardData, this.middleCards, faceDown, forcePositionIndex);
    }

    async drawingCardToDealer(cardData: CardModel, faceDown: boolean, forcePositionIndex?: number) {
        await this.dealCard(cardData, this.dealerCards, faceDown, forcePositionIndex);
    }
    async drawingCardToMiddle(cardData: CardModel, faceDown: boolean, forcePositionIndex?: number) {
        await this.dealCard(cardData, this.middleCards, faceDown, forcePositionIndex);
    }

    async drawingCardToPlayer(cardData: CardModel, faceDown: boolean, forcePositionIndex?: number) {
        await this.dealCard(cardData, this.playerCards, faceDown, forcePositionIndex);
    }

    async faceUpDealerCard(cardData: CardModel, indexCard: number) {
        await this.faceUpCard(cardData, this.dealerCards, indexCard);
    }

    private faceUpCard(cardInfo: CardModel, cardHand: HoldemPokerHandPlace, indexCard: number): Promise<void> {
        const selectedCard = cardHand.getCards()[indexCard];
        if (!selectedCard) return;
        const duration = 0.6;
        const cardComponent = selectedCard.getComponent(HoldemPokerCard);

        return new Promise((resolve) => {
            cc.tween(selectedCard)
                .call(() => {
                    cardComponent.setCardOldStyle(cardInfo);
                    cardComponent.playAnimation(CardAnimation.DealerOpenCard, duration);
                })
                .delay(duration)
                .call(() => resolve())
                .start();
        });
    }

    private dealCardWithoutAnimation(
        cardInfo: CardModel,
        cardHand: HoldemPokerHandPlace,
        faceDown: boolean,
        forcePositionIndex?: number
    ): Promise<void> {
        const cardNode = this.createCard(cardInfo, 0.9, 0.9);
        cardNode.active = false;
        const cardComponent = cardNode.getComponent(HoldemPokerCard);
        cardComponent.setFaceUp(!faceDown);
        const startWorldPos = this.cardBox.convertToWorldSpaceAR(cc.v2(0, 0));
        const startLocalPos = cardHand.cardLayout.content.convertToNodeSpaceAR(startWorldPos);
        const nextPosition = cardHand.cardLayout.getNextPosition();
        const rotationX = cc.v3(0);
        cardNode.position = cc.v3(startLocalPos.x, startLocalPos.y, 0);
        cardHand.addCard(cardNode);

        const moveDuration = 0;
        return new Promise((resolve) => {
            cc.tween(cardNode)
                .to(moveDuration, {
                    position: nextPosition,
                    eulerAngles: rotationX
                })
                .call(() => {
                    cardNode.active = true;
                })
                .call(() => resolve())
                .start();
        });
    }

    private dealCard(cardInfo: CardModel, cardHand: HoldemPokerHandPlace, faceDown: boolean, forcePositionIndex?: number): Promise<void> {
        const cardNode = this.createCard(cardInfo, 1, 1);
        const cardComponent = cardNode.getComponent(HoldemPokerCard);
        const startWorldPos = this.cardBox.convertToWorldSpaceAR(cc.v2(0, 0));
        const startLocalPos = cardHand.cardLayout.content.convertToNodeSpaceAR(startWorldPos);
        const nextPosition = cardHand.cardLayout.getNextPosition();
        const rotationX = cc.v3(0);
        cardNode.position = cc.v3(startLocalPos.x, startLocalPos.y, 0);
        cardHand.addCard(cardNode);

        const pullDuration = 0.2;
        const moveDuration = 0.35;

        return new Promise((resolve) => {
            cc.tween(cardNode)
                .call(() => {
                    this.playAudioCardSliding();
                    cardComponent.playAnimation(CardAnimation.PullCard, pullDuration);
                })
                .delay(pullDuration)
                .call(() => {
                    this.playAudioCardSliding();
                })
                .call(() => {
                    cardComponent.playAnimation(faceDown ? CardAnimation.DealerDrawingFaceDown : CardAnimation.DealerToHand, moveDuration);
                })
                .to(moveDuration, {
                    position: nextPosition,
                    eulerAngles: rotationX
                })
                .call(() => resolve())
                .start();
        });
    }

    private collectCards(containerCards: HoldemPokerHandPlace) {
        const delayBeforeFlyToDealer = 0.4;
        const durationJumpToBoxCard = 0.5;

        const worldPosition = this.cardDropPlace.convertToWorldSpaceAR(cc.v2(0, 0));
        containerCards.cardLayout.shadow.active = false;
        let cardHeight = 0;
        const increment = 3;
        const cardsNodes = containerCards.getCards();

        if (!cardsNodes.length) return;
        const destPosition = cardsNodes[0].parent.convertToNodeSpaceAR(worldPosition);

        const flyCardToDropPlace = (cardNode: cc.Node) => {
            cc.tween(cardNode)
                .call(() => cardNode.removeAllChildren())
                .removeSelf()
                .start();
        };

        cardsNodes.forEach((cardNode) => {
            cardHeight += increment;
            const destination = cc.v2(destPosition.x, destPosition.y + cardHeight);
            cc.tween(cardNode)
                .to(0.3, { position: cc.v2(0, 0) })
                .call(() => {
                    const cardComponent = cardNode.getComponent(HoldemPokerCard);
                    cardComponent.playAnimation(CardAnimation.DropCard, 0.5);
                })
                .parallel(cc.jumpTo(durationJumpToBoxCard, destination, 100, 1), cc.rotate3DTo(0.1, cc.v3(25, -5, 0)), cc.scaleTo(0.1, 0.8))
                .delay(delayBeforeFlyToDealer)
                .call(() => flyCardToDropPlace(cardNode))
                .start();
        });
    }

    public collectCardsOnTable() {
        const getDurationUnselectCard = () => {
            if (this.playerCards.Selected) {
                this.playerCards.Selected = false;
                return 0.5;
            }
            return 0;
        };
        this.schedule(
            () => {
                this.collectCards(this.playerCards);
                this.collectCards(this.middleCards);
                this.collectCards(this.dealerCards);
            },
            null,
            null,
            getDurationUnselectCard()
        );
    }

    public showIndicatorSymbolOfCards(combineCard: CardModel[], whose: string) {
        switch (whose) {
            case "player":
                this.showIndicatorCard(combineCard, [
                    { row: this.playerCards, position: "top", whose: "player" },
                    { row: this.middleCards, position: "bot", whose: "player" }
                ]);
                break;
            case "dealer":
                this.showIndicatorCard(combineCard, [
                    { row: this.dealerCards, position: "top", whose: "dealer" },
                    { row: this.middleCards, position: "top", whose: "dealer" }
                ]);
                break;
            default:
                break;
        }
    }

    public showLabelIndicatorCards(labelId: number, whose: string) {
        switch (whose) {
            case "player":
                this.updateLabel(this.combinePlayerCardResult, labelId);
                break;
            case "dealer":
                this.updateLabel(this.combineDealerCardResult, labelId);
                break;
            default:
                break;
        }
    }

    private updateLabel(combineCardResult: cc.Node, labelId: number) {
        const label = combineCardResult.getChildByName("text").getComponent(cc.Label);
        const result = `holdEmPoker.${CombineCardResultLabel[labelId].dataId}`;
        label.string = `${i18n.t(result)}`;
        combineCardResult.active = true;
    }

    public hideAllIndicator() {
        this.playerCards
            .getCards()
            .forEach((c) => c.getChildByName("card").getChildByName("Arrows").getComponent(HoldemPokerArrows).hideAllArrow());
        this.dealerCards
            .getCards()
            .forEach((c) => c.getChildByName("card").getChildByName("Arrows").getComponent(HoldemPokerArrows).hideAllArrow());
        this.middleCards
            .getCards()
            .forEach((c) => c.getChildByName("card").getChildByName("Arrows").getComponent(HoldemPokerArrows).hideAllArrow());
    }
    public hideAllLabelIndicatorCards() {
        this.combinePlayerCardResult.active = false;
        this.combineDealerCardResult.active = false;
    }

    private showIndicatorCard(
        combineCards: CardModel[],
        cardHands: { row: HoldemPokerHandPlace; position: string; whose: string }[],
        waitingCardRender = 0.1
    ) {
        this.schedule(
            () => {
                cardHands.forEach((cardHand) => {
                    const cardsInRow = cardHand.row.getCards();
                    cardsInRow.forEach((cardInRow) => {
                        const card = cardInRow.getComponent(HoldemPokerCard).getCard();
                        const combineCard = combineCards.find((e) => {
                            return e.rank === card.rank && e.suit === card.suit;
                        });
                        if (combineCard) {
                            cardInRow
                                .getChildByName("card")
                                .getChildByName("Arrows")
                                .getComponent(HoldemPokerArrows)
                                .showArrow(cardHand.position, cardHand.whose);
                        }
                    });
                });
            },
            null,
            null,
            waitingCardRender
        );
    }
}
