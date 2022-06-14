import { CardModel } from "../../BlockchainBaccaratType";
import BlockchainCard from "../card-list/BlockchainCard";

const { ccclass, property } = cc._decorator;

export enum CardAnimation {
    DealerToHand = "chia-bai",
    DropCard = "thu-bai",
    DealerCheckBlackJackFail = "dealer_check_blackjack_fail",
    DealerCheckBlackJackSuccess = "dealer_check_blackjack_success",
    DealerOpenCard = "dealer_open_card",
    DealerDrawingFaceDown = "dealer_drawing_face_down",
    PullCard = "pull_card"
}

enum OrderCards {
    card1 = 0,
    card2,
    card3
}

type CardFlyValue = {
    card: cc.Node;
    start: cc.Node;
    isCardThree?: boolean;
    isReserve?: boolean;
    scale?: number;
};

@ccclass
export default class BlockchainBaccaratCards extends cc.Component {
    @property(cc.Prefab)
    cardsPrefab: cc.Prefab = null;

    @property(cc.Node)
    cards: cc.Node[] = [];

    @property(cc.Node)
    cardsBox: cc.Node = null;

    @property(cc.Node)
    cardsDrop: cc.Node = null;

    @property(cc.Label)
    point: cc.Label = null;

    @property
    isBanker = false;

    readonly durationFlyCard = 0.5;
    readonly durationFlyCard3 = 0.2;
    readonly durationDropCard = 0.2;
    readonly durationJumpDrop = 0.4;
    readonly setPointSecond = 0.2;
    protected SET_POINT = 3;
    clonePositionCards: cc.Vec3[] = [];

    onLoad = () => {
        this.cards.forEach((card, index) => {
            this.clonePositionCards[index] = card.position;
        });
    };

    setTagIndex(index: number, card: cc.Node) {
        card.getComponentInChildren(BlockchainCard).setIndexNumer(index);
    }

    resetCards() {
        this.resetPoint();
        this.cards.forEach((card: cc.Node) => {
            this.resetCard(card);
        });
    }

    resetCard(card: cc.Node) {
        const cardNode = card?.getComponentInChildren(BlockchainCard);
        if (cardNode) {
            cardNode.faceDown();
            cardNode.resetHighlight();
            card.opacity = 0;
            card.scale = 0.5;
            card.angle = -135;
        }
    }

    private resetPoint() {
        if (this.point) {
            this.point.node.parent.active = false;
            this.point.string = "0";
        }
    }

    async flyCard1(numberTag: number, delay = this.durationFlyCard) {
        await this.flyCard(this.cards[OrderCards.card1], delay, numberTag);
    }

    async flyCard2(numberTag: number, delay = this.durationFlyCard) {
        await this.flyCard(this.cards[OrderCards.card2], delay, numberTag);
    }

    async flyCard3(node: cc.Node, start: cc.Node, delay = this.durationFlyCard3) {
        await this.flyCard(node, delay, 0, start, true);
    }

    async flyCard1Reserve(numberTag: number, card: cc.Node, start: cc.Node, delay = this.durationFlyCard) {
        await this.flyCardReserve(card, delay, numberTag, start);
    }

    private flyCard(
        card: cc.Node,
        delay: number,
        numberTag?: number,
        start = this.cardsBox,
        isCardThree = false,
        scale = 1
    ): Promise<void> {
        return new Promise((resolve) => {
            const cardComponent = card.getComponentInChildren(BlockchainCard);
            cc.tween(card)
                .delay(delay)
                .call(() => {
                    this.setInfoCardFly(cardComponent, numberTag);
                    this.actionCardFly({
                        card,
                        start,
                        isCardThree: isCardThree,
                        scale
                    });
                })
                .call(() => resolve())
                .start();
        });
    }

    private flyCardReserve(card: cc.Node, delay: number, numberTag: number, start: cc.Node): Promise<void> {
        return new Promise((resolve) => {
            const cardComponent = card.getComponentInChildren(BlockchainCard);
            cc.tween(card)
                .delay(delay)
                .call(() => {
                    this.setInfoCardFly(cardComponent, numberTag);
                    this.actionCardFly({
                        card,
                        start,
                        isReserve: true
                    });
                })
                .call(() => resolve())
                .start();
        });
    }

    setInfoCardFly(cardComponent: BlockchainCard, numberTag: number) {
        numberTag > 0 && cardComponent.setIndexNumer(numberTag);
        cardComponent.setStatusInfoTag(true);
        cardComponent.setStatusIndexNumber(true);
    }

    private actionCardFly({ card, start, isCardThree, isReserve, scale }: CardFlyValue) {
        const convertCardBox: cc.Vec3 = cc.v3(card.parent.convertToNodeSpaceAR(start.convertToWorldSpaceAR(cc.v2(0, 0))));
        const cardPosition = card.position;
        card.position = convertCardBox;
        card.opacity = 255;
        if (isReserve) {
            card.scale = 1;
            card.rotation = 0;
            card.runAction(cc.moveTo(this.durationFlyCard, cc.v2(cardPosition.x, cardPosition.y)).easing(cc.easeInOut(2)));
        } else {
            card.runAction(
                cc.spawn(
                    cc.rotateTo(this.durationFlyCard, isCardThree ? (this.isBanker ? 90 : -90) : 0).easing(cc.easeInOut(2)),
                    cc.scaleTo(this.durationFlyCard, scale).easing(cc.easeInOut(2)),
                    cc.moveTo(this.durationFlyCard, cc.v2(cardPosition.x, cardPosition.y)).easing(cc.easeInOut(2))
                )
            );
        }
    }

    dropCards(durationJumpToBoxCard: number, duration: number): Promise<void> {
        this.resetPoint();
        return new Promise<void>((resolve) => {
            const worldPosition = this.cardsDrop.convertToWorldSpaceAR(cc.v2(0, 0));
            this.cards.forEach((cardNode: cc.Node, index) => {
                const destPosition = this.cards[index].parent.convertToNodeSpaceAR(worldPosition);
                const cardComponent: BlockchainCard = cardNode.getComponentInChildren(BlockchainCard);
                cardComponent.setStatusInfoTag(false);
                cc.tween(cardNode)
                    .to(0.3, { position: cc.v2(0, 0) })
                    .call(() => {
                        cardComponent.playAnimation(CardAnimation.DropCard, 0.5);
                    })
                    .then(cc.jumpTo(durationJumpToBoxCard, destPosition, 250, 1))
                    .delay(duration)
                    .call(() => {
                        this.resetCard(cardNode);
                        resolve();
                    })
                    .delay(0.2)
                    .call(() => {
                        this.setPositionCardsAfterDrop(cardComponent, cardNode, index);
                    })
                    .start();
            });
        });
    }

    private setPositionCardsAfterDrop(cardComponent: cc.Component, cardNode: cc.Node, index: number) {
        cardNode.position = this.clonePositionCards[index];
        cardComponent.node.getChildByName("card").position = cc.v3(0, 0, 0);
        cardComponent.node.getChildByName("card").scale = 0.5;
        cardComponent.node.getChildByName("card").skewX = 0;
        cardComponent.node.getChildByName("card").skewY = 0;
        cardComponent.node.getChildByName("card").opacity = 255;
        cardComponent.node.getChildByName("card").rotation = 0;
    }

    async openCards(card: cc.Node, cardData: CardModel, isAnimated = true) {
        await this.actionOpenCards(cardData, card, isAnimated);
        this.handleSetPoint(cardData, card);
    }

    private async actionOpenCards(cardData: CardModel, currentCard: cc.Node, isAnimated = true) {
        if (isAnimated) {
            await this.faceUpCard(cardData, currentCard);
        }
    }

    private faceUpCard(cardInfo: CardModel, card: cc.Node): Promise<void> {
        const duration = 0.6;
        const cardComponent = card.getComponentInChildren(BlockchainCard);
        return new Promise((resolve) => {
            cc.tween(card)
                .delay(duration)
                .call(() => {
                    cardComponent.setCardOldStyle({
                        rank: cardInfo.rank.toString(),
                        suit: cardInfo.suit
                    });
                    cardComponent.setStatusIndexNumber(false);
                    cardComponent.playAnimation(CardAnimation.DealerOpenCard, duration);
                })

                .call(() => resolve())
                .start();
        });
    }

    private handleSetPoint(data: CardModel, currentCard: cc.Node, delayTime = this.setPointSecond) {
        const pointValue: number = +data.rank + 1;
        const setPoint = cc.sequence(
            cc.delayTime(delayTime),
            cc.callFunc(() => this.setPoint(pointValue >= 10 ? 0 : pointValue))
        );

        currentCard.stopActionByTag(this.SET_POINT);
        setPoint.setTag(this.SET_POINT);
        currentCard.runAction(setPoint);
    }

    private setPoint(point: number) {
        this.point.node.active = true;
        this.point.node.parent.active = true;

        const currentPoint = parseInt(this.point.string);
        this.point.node.parent.runAction(cc.sequence(cc.scaleTo(this.setPointSecond, 1.1, 1.1), cc.scaleTo(this.setPointSecond, 1, 1)));

        this.point.string = ((currentPoint + point) % 10).toString();
    }
}
