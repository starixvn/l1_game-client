import { i18n, lodash } from "../../../ClientModules";
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
    private readonly SHOW_FINISH_CARD = 2;
    protected SET_POINT = 3;
    private clonePositionCards: cc.Vec3[] = [];

    private tempCard1 = null;
    private tempCard2 = null;
    private tempCard3 = null;
    onLoad() {
        this.card1.children[0].getComponent(NewCard).faceDown();
        this.card2.children[0].getComponent(NewCard).faceDown();
        this.card3.children[0].getComponent(NewCard).faceDown();

        this.clonePositionCards[0] = this.card1.position;
        this.clonePositionCards[1] = this.card2.position;
        this.clonePositionCards[2] = this.card3.position;

        // this.tempCard1 = lodash.clone(this.card1);
        // this.tempCard2 = lodash.clone(this.card2);
        // this.tempCard3 = lodash.clone(this.card3);
    }

    init(playAudio, isMainPage = true) {
        if (playAudio) {
            this.playGetCardAudio = playAudio;
        }

        this.isMainPage = isMainPage;
    }

    resetCards() {
        this.resetCard(this.card1);
        this.resetCard(this.card2);
        this.resetCard(this.card3);
        // this.card1 = lodash.clone(this.tempCard1);
        // this.card2 = lodash.clone(this.tempCard2);
        // this.card3 = lodash.clone(this.tempCard3);

        this.showHighlightCards(false);
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
        this.node.stopActionByTag(this.SHOW_FINISH_CARD);
        this.card1.stopActionByTag(this.SET_POINT);
        this.card2.stopActionByTag(this.SET_POINT);
        this.card3.stopActionByTag(this.SET_POINT);
    }

    flyFirstCard() {
        this.flyCard(this.card1);
    }

    flySecondCard() {
        this.flyCard(this.card2);
    }

    flyThirdCard() {
        this.flyCard(this.card3);
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

    flyCard(card: cc.Node, scale = 1, from: cc.Vec3 = this.cardsBox.position) {
        const cardPosition = card.position;
        card.position = from;
        card.opacity = 255;
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

    resetCard(card: cc.Node) {
        this.hideRank();
        card.children[0].getComponent(NewCard).faceDown();
        card.opacity = 0;
        card.scale = 0.5;
        card.angle = -135;
        card.getComponent(BaccaratCard).numberTag.active = true;
    }

    protected openCard(index: number, cards: any[], isAnimated = true) {
        let delayTime = 0;
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

            delayTime = this.handleCardWithAnimated(isAnimated, index, currentCard, delayTime);
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

    public collectCards() {
        return new Promise<void>((resolve) => {
            const durationJumpToBoxCard = 0.5;

            const worldPosition = this.cardDropPlace.convertToWorldSpaceAR(cc.v2(0, 0));
            const cardsNodes = [this.card1, this.card2, this.card3];

            if (!cardsNodes.length) {
                resolve();
                return;
            }

            cardsNodes.forEach((cardNode, index) => {
                const destPosition = cardNode.parent.convertToNodeSpaceAR(worldPosition);
                cc.tween(cardNode)
                    .to(0.3, { position: cc.v2(0, 0) })
                    .call(() => {
                        // const cardComponent = cardNode.getComponent(NewCard);
                        // cardComponent.playAnimation(CardAnimation.DropCard, 0.5);
                    })
                    .then(cc.jumpTo(durationJumpToBoxCard, destPosition, 250, 1))
                    // .call(() => {
                    //     this.resetCard(cardNode);
                    // })
                    // .delay(0.2)
                    .call(() => {
                        const cardComponent = cardNode?.getComponentInChildren(NewCard);
                        this.setPositionCardsAfterDrop(cardComponent, cardNode, index);
                        // cardNode.destroy();
                        resolve();
                    })
                    .start();
            });
        });
    }

    private setPositionCardsAfterDrop(cardComponent: cc.Component, cardNode: cc.Node, index: number) {
        // cardNode && this.clonePositionCards?.[index] && (cardNode.position = this.clonePositionCards[index]);
        cardNode.position = this.clonePositionCards[index];
        if (cardComponent) {
            cardComponent.node.position = cc.v3(0, 0, 0);
            cardComponent.node.scale = 1;
            cardComponent.node.skewX = 0;
            cardComponent.node.skewY = 0;
            cardComponent.node.opacity = 255;
            cardComponent.node.rotation = 0;
        }
    }
}
