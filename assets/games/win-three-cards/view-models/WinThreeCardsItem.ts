import { i18n } from "../../../ClientModules";
import AudioManager from "../../../common/audio/AudioManager";
import { getNameCard } from "../../../common/helpers/CardHelper";
import NewCard, { CardAnimation } from "../../../common/new-card/view-models/NewCard";
import BaccaratCard from "../../baccarat/view-models/BaccaratCard";
import { WinThreeCardResult } from "./models/WinThreeCardsModel";

const { ccclass, property } = cc._decorator;

enum Ranks {
    highCard = 1,
    onePair,
    straight,
    flush,
    straightFlush,
    threeOfAKind,
    killer235
}

@ccclass
export default class WinThreeCardsCards extends cc.Component {
    @property(cc.Node)
    card1: cc.Node = null;

    @property(cc.Node)
    card2: cc.Node = null;

    @property(cc.Node)
    card3: cc.Node = null;

    @property(cc.Sprite)
    cardBack: cc.Sprite = null;

    @property()
    flyX = 0;

    @property
    isDragon = false;

    @property(cc.Node)
    cardsBox: cc.Node = null;

    @property(cc.Label)
    numberTagCardBack: cc.Label = null;

    @property(cc.Node)
    rank: cc.Node = null;

    @property(cc.Label)
    handRank: cc.Label = null;

    @property(cc.Label)
    cardRank: cc.Label = null;

    @property(cc.Node)
    cardDropPlace: cc.Node = null;

    protected playGetCardAudio = () => {
        // handle
    };
    protected readonly flyCardSecond = 0.8;
    protected readonly openCardSecond = 0.3;
    protected readonly openSecondCardSecond = 1.6;
    protected readonly openThirdCardSecond = 2.6;
    protected readonly setPointSecond = 0.2;
    protected isMainPage = false;

    private readonly SHOW_CARD = 1;
    private clonePositionCards: cc.Vec3[] = [];
    private cardsNodes: cc.Node[] = [];

    onLoad() {
        this.cardsNodes = [this.card1, this.card2, this.card3];
        this.cardsNodes.forEach((cardNode: cc.Node, index: number) => {
            cardNode.getComponentInChildren(NewCard).faceDown();
            this.clonePositionCards[index] = cardNode.position;
        });
    }

    init(playAudio, isMainPage = true) {
        if (playAudio) {
            this.playGetCardAudio = playAudio;
        }

        this.isMainPage = isMainPage;
    }

    showHighlightCards(highlight = true) {
        for (let i = 1; i <= 3; i++) {
            const card = this[`card${i}`];
            const baccaratCard = card.getComponent(BaccaratCard);
            highlight ? baccaratCard.setHighlight() : baccaratCard.resetHighlight();
        }
    }

    showCardsWithoutAnimation(cards: any[]) {
        this.resetSomeActionCards();
        this.openCard(0, cards, false);
        this.openCard(1, cards, false);
        this.openCard(2, cards, false);
    }

    showCards(cardResult: WinThreeCardResult, onFinishShowCards: () => void): void {
        const { cards } = cardResult;
        const handleCard = cc.sequence(
            cc.callFunc(() => {
                this.open2FirstCard(cards);
            }),
            cc.callFunc(() => this.openCard3(cardResult, onFinishShowCards))
        );
        this.resetSomeActionCards();
        handleCard.setTag(this.SHOW_CARD);
        this.node.runAction(handleCard);
    }

    private setRank(cardResult: WinThreeCardResult) {
        this.handRank.node.active = true;
        this.handRank.string = i18n.t(`winThreeCards.${Ranks[cardResult.handRankId]}`);

        if (cardResult.cardRankId >= 0) {
            this.cardRank.node.active = true;
            this.cardRank.string = getNameCard(cardResult.cardRankId);
        }

        this.rank.active = true;
    }

    hideRank() {
        this.rank.active = false;
    }

    protected resetSomeActionCards() {
        this.node.stopActionByTag(this.SHOW_CARD);
    }

    private open2FirstCard(cards: any[]) {
        this.node.runAction(
            cc.sequence(
                cc.delayTime(this.isDragon ? 0 : this.openSecondCardSecond), // Waiting for player open 2nd card
                cc.callFunc(() => {
                    this.openCard(0, cards);
                    this.openCard(1, cards);
                })
            )
        );
    }

    private openCard3(cardResult: WinThreeCardResult, onFinishShowCards) {
        this.node.runAction(
            cc.sequence(
                cc.delayTime(this.openThirdCardSecond + (this.isDragon ? 0 : this.openSecondCardSecond)), // Waiting for player open 2nd card
                cc.callFunc(() => this.openCard(2, cardResult.cards)),
                cc.delayTime(1),
                cc.callFunc(() => this.setRank(cardResult)),
                cc.delayTime(this.openThirdCardSecond),
                cc.callFunc(() => onFinishShowCards && onFinishShowCards())
            )
        );
    }

    public flyCard(cardNumber: number, scale = 1) {
        const card = this.cardsNodes[cardNumber];
        const boxWorldPosition = this.cardsBox.convertToWorldSpaceAR(cc.v2(0, 0));
        const boxPosition = card.parent.convertToNodeSpaceAR(boxWorldPosition);
        if (card && card.isValid) {
            const cardPosition = card.position;
            card.position = cc.v3(boxPosition.x, boxPosition.y);
            card.opacity = 255;
            card.scale = 0.4;
            card?.getComponent(BaccaratCard) && (card.getComponent(BaccaratCard).numberTag.parent.active = true);

            card.runAction(
                cc.spawn(
                    cc.rotateTo(this.flyCardSecond, 0).easing(cc.easeInOut(2)),
                    cc.scaleTo(this.flyCardSecond, scale).easing(cc.easeInOut(2)),
                    cc.moveTo(this.flyCardSecond, cc.v2(cardPosition.x, cardPosition.y)).easing(cc.easeInOut(2))
                )
            );

            if (AudioManager.getInstance().sfxEnabled) {
                card.runAction(
                    cc.sequence(
                        cc.delayTime(0.2),
                        cc.callFunc(() => this.playGetCardAudio())
                    )
                );
            }
        }
    }

    private resetCard(card: cc.Node) {
        const cardNode = card.getComponentInChildren(NewCard);
        cardNode.faceDown();
        card.opacity = 0;
        card.scale = 1;
        card.angle = -135;
    }

    private openCard(index: number, cards: any[], isAnimated = true) {
        if (index < cards.length) {
            const cardData = cards[index];
            const currentCard = this[`card${index + 1}`] as cc.Node;

            currentCard.active = false;
            if (cardData) {
                currentCard.active = true;
            }
            currentCard?.getComponent(BaccaratCard) && (currentCard.getComponent(BaccaratCard).numberTag.parent.active = false);

            const newCard = currentCard.children[0].getComponent(NewCard);
            newCard.setCardOldStyle({
                rank: cardData.rank,
                suit: cardData.suit
            });

            newCard.faceUp();
            this.handleCardWithAnimated(isAnimated, index, currentCard, 0);
        }
    }

    private handleCardWithAnimated(isAnimated: boolean, index: number, currentCard: cc.Node, delayTime: number): number {
        if (isAnimated) {
            delayTime = this.calculateDelayTimeWithAnimation(index, currentCard, delayTime);
        } else {
            if (this.isMainPage) {
                currentCard.getComponent(BaccaratCard).numberTag.active = false;
            }
        }

        return delayTime;
    }

    private calculateDelayTimeWithAnimation(index: number, currentCard: cc.Node, delayTime: number) {
        if (index === 2) {
            // 3rd card
            this.cardBack.node.active = true;
            const position = cc.v3(currentCard.position.x - currentCard.width / 2, currentCard.position.y - currentCard.height / 2, 0);
            this.cardBack.node.position = position;
            const card = currentCard.getComponent(BaccaratCard);
            card.numberTag.active = false;
            this.numberTagCardBack.string = card.getNumberTag();
            this.setActionCardBack();
        } else {
            currentCard.scaleX = 0;
            currentCard.runAction(cc.scaleTo(this.openCardSecond, 1, 1));
            this.card1.getComponent(BaccaratCard).numberTag.active = false;
        }

        delayTime += this.openCardSecond;
        return delayTime;
    }

    private setActionCardBack() {
        this.cardBack.node.runAction(
            cc.sequence(
                cc.moveBy(0.8, cc.v2(10, -10)).easing(cc.easeSineOut()),
                cc.spawn(
                    cc.moveBy(0.8, cc.v2(150, -150)).easing(cc.easeExponentialInOut()),
                    cc.fadeOut(0.8).easing(cc.easeExponentialInOut())
                ),
                cc.callFunc(() => {
                    this.cardBack.node.active = false;
                    this.cardBack.node.opacity = 255;
                })
            )
        );
    }

    dropCards(durationJumpToBoxCard = 0.6, duration = 0.2) {
        this.hideRank();
        const promises = [];
        this.cardsNodes.forEach((cardNode: cc.Node, index) => {
            promises.push(this.actionDropCard(cardNode, index, durationJumpToBoxCard, duration, this.cardDropPlace));
        });

        return promises;
    }

    private actionDropCard(cardNode: cc.Node, cardIndex: number, durationJumpToBoxCard: number, duration: number, cardDropPlace: cc.Node) {
        return new Promise<void>((resolve) => {
            const worldPosition = cardDropPlace.convertToWorldSpaceAR(cc.v2(0, 0));
            const cardComponent = cardNode.getComponentInChildren(NewCard);
            const destPosition = cardNode.parent.convertToNodeSpaceAR(worldPosition);
            const baccaratCardComponent = cardNode.getComponent(BaccaratCard);
            baccaratCardComponent.numberTag.active = true;
            baccaratCardComponent.resetHighlight();

            cc.tween(cardNode)
                .to(0.3, { position: cc.v2(0, 0) })
                .call(() => {
                    cardComponent.playAnimation(CardAnimation.DropCard, 0.5);
                })
                .then(cc.jumpTo(durationJumpToBoxCard, destPosition, 100, 1))
                .delay(0.5)
                .call(() => {
                    this.resetCard(cardNode);
                })
                .delay(duration)
                .call(() => {
                    this.setPositionCardsAfterDrop(cardComponent, cardNode, cardIndex);
                    resolve();
                })
                .start();
        });
    }

    private setPositionCardsAfterDrop(cardComponent: cc.Component, cardNode: cc.Node, index: number) {
        cardNode && this.clonePositionCards?.[index] && (cardNode.position = this.clonePositionCards[index]);
        if (cardComponent) {
            cardComponent.node.getChildByName("card").position = cc.v3(0, 0, 0);
            cardComponent.node.getChildByName("card").scale = 0.5;
            cardComponent.node.getChildByName("card").skewX = 0;
            cardComponent.node.getChildByName("card").skewY = 0;
            cardComponent.node.getChildByName("card").opacity = 255;
            cardComponent.node.getChildByName("card").rotation = 0;
        }
    }
}
