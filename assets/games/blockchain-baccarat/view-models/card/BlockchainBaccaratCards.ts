import { callData } from "./../../../../../__tests__/games/texas-holdem-poker/_base/index";
import { CardModel, CardModelNew as CardModelOld } from "../../BlockchainBaccaratType";
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

    @property()
    flyX = 0;

    protected playGetCardAudio = () => {
        //playGetCardAudio
    };
    readonly flyCardSecond = 0.8;
    readonly flyCardThree = 0.3;
    readonly openSecondCardSecond = 1.6;
    readonly setPointSecond = 0.2;
    protected SET_POINT = 3;
    clonePositionCards: cc.Vec3[] = [];
    clonePostionCardBack: cc.Vec3 = null;

    onLoad = () => {
        //onLoad
        this.cards.forEach((card, index) => {
            this.clonePositionCards[index] = card.position;
        });
    };

    private onFaceDown(node: cc.Node) {
        if (node?.getComponent(BlockchainCard)) {
            const componentCard = node.getComponent(BlockchainCard);
            componentCard.cardBack.active = true;
            this.clonePostionCardBack = componentCard.cardBack.position;
        }
    }

    setTagIndex(index: number, card: cc.Node) {
        card.getComponentInChildren(BlockchainCard).indexNumber.string = index.toString();
    }

    resetCards() {
        this.resetPoint();

        this.cards.forEach((card: cc.Node) => {
            this.resetCard(card);
        });

        // this.showHighlightCards(false);
    }

    resetCard(card: cc.Node) {
        const cardNode = card?.getComponentInChildren(BlockchainCard);
        if (cardNode) {
            cardNode.faceDown();
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

    async flyCard1(numberTag: number, delay = this.flyCardSecond) {
        await this.flyCard(this.cards[OrderCards.card1], delay, numberTag);
    }

    async flyCard2(numberTag: number, delay = this.flyCardSecond) {
        await this.flyCard(this.cards[OrderCards.card2], delay, numberTag);
    }

    async flyCard3(node: cc.Node, start: cc.Node, delay = this.flyCardThree) {
        await this.flyCard(node, delay, 0, start);
    }

    async flyCard1Reserve(numberTag: number, card: cc.Node, start: cc.Node, delay = this.flyCardThree) {
        await this.flyCardReserve(card, delay, numberTag, start);
    }

    private flyCard(card: cc.Node, delay: number, numberTag?: number, start = this.cardsBox, scale = 1): Promise<void> {
        return new Promise((resolve) => {
            cc.tween(card)
                .delay(delay)
                .call(() => {
                    numberTag > 0 && (card.getComponentInChildren(BlockchainCard).indexNumber.string = numberTag.toString());
                    const convertCardBox: cc.Vec3 = cc.v3(card.parent.convertToNodeSpaceAR(start.convertToWorldSpaceAR(cc.v2(0, 0))));
                    const cardPosition = card.position;
                    card.position = convertCardBox;
                    card.opacity = 255;
                    card.runAction(
                        cc.spawn(
                            cc.rotateTo(this.flyCardSecond, 0).easing(cc.easeInOut(2)),
                            cc.scaleTo(this.flyCardSecond, scale).easing(cc.easeInOut(2)),
                            cc.moveTo(this.flyCardSecond, cc.v2(cardPosition.x, cardPosition.y)).easing(cc.easeInOut(2))
                        )
                    );
                })
                .call(() => resolve())
                .start();
        });
    }

    private flyCardReserve(card: cc.Node, delay: number, numberTag: number, start: cc.Node): Promise<void> {
        return new Promise((resolve) => {
            cc.tween(card)
                .delay(delay)
                .call(() => {
                    card.getComponentInChildren(BlockchainCard).indexNumber.string = numberTag.toString();
                    const convertCardBox: cc.Vec3 = cc.v3(card.parent.convertToNodeSpaceAR(start.convertToWorldSpaceAR(cc.v2(0, 0))));
                    const cardPosition = card.position;
                    card.position = convertCardBox;
                    card.opacity = 255;
                    card.scale = 1;
                    card.rotation = 0;
                    card.runAction(cc.moveTo(this.flyCardSecond, cc.v2(cardPosition.x, cardPosition.y)).easing(cc.easeInOut(2)));
                })
                .call(() => resolve())
                .start();
        });
    }

    async collectCards() {
        const worldPosition = this.cardsDrop.convertToWorldSpaceAR(cc.v2(0, 0));
        this.resetPoint();

        this.cards.forEach((card, index) => {
            const destPosition = card.parent.convertToNodeSpaceAR(worldPosition);
            this.dropCards(card, destPosition, index, 0.5);
        });
    }

    private dropCards(cardNode: cc.Node, destPosition: cc.Vec2, index: number, durationJumpToBoxCard: number): Promise<void> {
        return new Promise<void>((resolve) => {
            const cardComponent: BlockchainCard = cardNode.getComponentInChildren(BlockchainCard);
            cardComponent.indexNumber.node.active = true;
            cc.tween(cardNode)
                .to(0.3, { position: cc.v2(0, 0) })
                .call(() => {
                    cardComponent.playAnimation(CardAnimation.DropCard, 0.5);
                })
                .then(cc.jumpTo(durationJumpToBoxCard, destPosition, 250, 1))
                .delay(0.2)
                .call(() => {
                    this.resetCard(cardNode);

                    this.setPositionCardsAfterDrop(cardComponent, cardNode, index);
                    resolve();
                })
                .start();
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

    async openCard(index: number, card: cc.Node, cardData: CardModelOld, isAnimated = true, delayTime = 0) {
        const blockChainCard = card.getComponentInChildren(BlockchainCard);
        blockChainCard.setCardOldStyle({
            rank: cardData.rank.toString(),
            suit: cardData.suit
        });
        blockChainCard.faceUp();
        await this.actionOpenCards(isAnimated, index, card);
        this.handleSetPoint(cardData, delayTime, card);
    }

    async actionOpenCards(isAnimated: boolean, index: number, currentCard: cc.Node) {
        const blockchainCard = currentCard.getComponentInChildren(BlockchainCard);
        if (isAnimated) {
            blockchainCard.indexNumber.node.active = false;

            if (index < 2) {
                await this.actionCardBack(blockchainCard.cardBack);
                return;
            } else {
                blockchainCard.hideCardBack();
                await this.openCard3(currentCard);
            }
        }
    }

    private actionCardBack(cardBack: cc.Node): Promise<void> {
        return new Promise<void>((resolve) => {
            cc.tween(cardBack)
                .to(0.8, { position: cc.v2(10, -10) }, { easing: "easeSineOut" })
                .parallel(
                    cc.moveBy(0.8, cc.v2(150, -150)).easing(cc.easeExponentialInOut()),
                    cc.fadeOut(0.8).easing(cc.easeExponentialInOut())
                )
                .call(() => {
                    cardBack.active = false;
                    cardBack.opacity = 255;
                })
                .call(() => {
                    cardBack.position = this.clonePostionCardBack;
                    resolve();
                })
                .start();
        });
    }

    private openCard3(card: cc.Node): Promise<void> {
        return new Promise((resolve) => {
            cc.tween(card)
                .call(() => {
                    card.runAction(cc.rotateBy(0.5, this.isBanker ? -90 : 90).easing(cc.easeSineOut()));
                })
                .call(() => resolve())
                .start();
        });
    }

    private handleSetPoint(data: any, delayTime: number, currentCard: cc.Node) {
        const pointValue: number = data.rank + 1;
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
