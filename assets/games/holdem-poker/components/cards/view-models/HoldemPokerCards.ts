import * as i18n from "i18n/runtime-scripts/LanguageData";
import AudioManager from "../../../../../common/audio/AudioManager";

import HoldemPokerArrows from "./HoldemPokerArrows";
import HoldemPokerCard from "./HoldemPokerCard";
import HandPlace from "./HoldemPokerHandPlace";
import { CardAnimation, CardModel } from "../../../../../common/new-card/view-models/NewCard";

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
export default class HoldemPokerCards extends cc.Component {
    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    arrowPrefab: cc.Prefab = null;

    @property(cc.Node)
    cardBox: cc.Node = null;

    @property(HandPlace)
    dealerCards: HandPlace = null;

    @property(HandPlace)
    middleCards: HandPlace = null;

    @property(HandPlace)
    playerCards: HandPlace = null;

    @property(cc.Node)
    combineDealerCardResult: cc.Node = null;

    @property(cc.Node)
    combinePlayerCardResult: cc.Node = null;

    @property(cc.Node)
    cardDropPlace: cc.Node = null;

    @property(cc.AudioSource)
    cardSlideAudioSource: cc.AudioSource = null;

    get isCollectedCard() {
        return (
            this.middleCards.getCards().length === 0 && this.playerCards.getCards().length === 0 && this.dealerCards.getCards().length === 0
        );
    }

    private playAudioCardSliding() {
        AudioManager.getInstance().playSFX(this.cardSlideAudioSource.clip);
    }

    private createCard(card: CardModel, scaleX: number, scaleY: number): cc.Node {
        const node = cc.instantiate(this.cardPrefab);
        const cardComponent = node.getComponent(HoldemPokerCard);
        cardComponent.setCard(card);
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

    showArrowIndicatorCards(combineCard: CardModel[], whose: string) {
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
        cardHands: { row: HandPlace; position: string; whose: string }[],
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

    private faceUpCard(cardInfo: CardModel, cardHand: HandPlace, indexCard: number): Promise<void> {
        const selectedCard = cardHand.getCards()[indexCard];
        const duration = 0.6;
        const cardComponent = selectedCard.getComponent(HoldemPokerCard);

        return new Promise((resolve) => {
            cc.tween(selectedCard)
                .call(() => {
                    cardComponent.setCard(cardInfo);
                    cardComponent.playAnimation(CardAnimation.DealerOpenCard, duration);
                })
                .delay(duration)
                .call(() => resolve())
                .start();
        });
    }

    private dealCardWithoutAnimation(
        cardInfo: CardModel,
        cardHand: HandPlace,
        faceDown: boolean,
        forcePositionIndex?: number
    ): Promise<void> {
        const cardNode = this.createCard(cardInfo, 1, 1);
        cardNode.active = false;
        const cardComponent = cardNode.getComponent(HoldemPokerCard);
        cardComponent.setFaceUp(!faceDown);
        const startWorldPos = this.cardBox.convertToWorldSpaceAR(cc.v2(0, 0));
        const startLocalPos = cardHand.cardLayout.content.convertToNodeSpaceAR(startWorldPos);
        const nextPosition = cardHand.cardLayout.getNextPosition(forcePositionIndex);
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

    private dealCard(cardInfo: CardModel, cardHand: HandPlace, faceDown: boolean, forcePositionIndex?: number): Promise<void> {
        const cardNode = this.createCard(cardInfo, 1, 1);
        const cardComponent = cardNode.getComponent(HoldemPokerCard);
        const startWorldPos = this.cardBox.convertToWorldSpaceAR(cc.v2(0, 0));
        const startLocalPos = cardHand.cardLayout.content.convertToNodeSpaceAR(startWorldPos);
        const nextPosition = cardHand.cardLayout.getNextPosition(forcePositionIndex);
        const rotationX = cc.v3(0);
        cardNode.position = cc.v3(startLocalPos.x, startLocalPos.y, 0);
        cardHand.addCard(cardNode);

        const pullDuration = 0.2;
        const moveDuration = 0.35;
        return new Promise((resolve) => {
            cc.tween(cardNode)
                .call(() => {
                    cc.tween(this.node).call(() => {
                        cardComponent.playAnimation(CardAnimation.PullCard, pullDuration);
                    });
                })
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

    private collectCards(containerCards: HandPlace) {
        const durationJumpToBoxCard = 0.5;

        const worldPosition = this.cardDropPlace.convertToWorldSpaceAR(cc.v2(0, 0));
        containerCards.cardLayout.shadow.active = false;
        const cardsNodes = containerCards.getCards();

        if (!cardsNodes.length) {
            return;
        }
        const destPosition = cardsNodes[0].parent.convertToNodeSpaceAR(worldPosition);
        cardsNodes.forEach((cardNode) => {
            cc.tween(cardNode)
                .to(0.3, { position: cc.v2(0, 0) })
                .call(() => {
                    const cardComponent = cardNode.getComponent(HoldemPokerCard);
                    cardComponent.playAnimation(CardAnimation.DropCard, 0.5);
                })
                .then(cc.jumpTo(durationJumpToBoxCard, destPosition, 250, 1))
                .delay(0.2)
                .call(() => cardNode.destroy())
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
}
