import { CardModel } from "../../BlockchainBaccaratType";
import BlockchainCard from "../card-list/BlockchainCard";
import { cloneDeep } from "lodash";

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

    @property(cc.Node)
    point: cc.Node = null;

    @property
    isBanker = false;

    @property()
    flyX = 0;

    protected playGetCardAudio = () => {
        //playGetCardAudio
    };
    readonly flyCardSecond = 0.8;
    readonly flyCardThree = 0.3;
    readonly openCardSecond = 0.3;
    readonly openSecondCardSecond = 1.6;
    readonly setPointSecond = 0.2;
    protected isMainPage = false;
    protected SET_POINT = 3;
    cloneCardsPosition: cc.Vec3[] = [];

    onLoad = () => {
        //onLoad
        this.cards.forEach((card, index) => {
            this.cloneCardsPosition[index] = card.position;
        });
    };

    onFaceDown(node: cc.Node) {
        node?.getComponent(BlockchainCard)?.faceDown();
    }

    setTagIndex(index: number, card: cc.Node) {
        card.getComponentInChildren(BlockchainCard).indexNumber.string = index.toString();
    }

    protected createCard(card: CardModel, scaleX: number, scaleY: number): cc.Node {
        const node = cc.instantiate(this.cardsPrefab);
        const cardComponent = node.getComponent(BlockchainCard);
        cardComponent.setCardOldStyle(card);
        node.scaleX = scaleX;
        node.scaleY = scaleY;

        return node;
    }

    resetCards() {
        if (this.point) {
            this.point.parent.active = false;
            this.point.getComponent(cc.Label).string = "0";
        }

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

    flyCard(card: cc.Node, delay: number, numberTag?: number, start = this.cardsBox, scale = 1): Promise<void> {
        console.log(numberTag, "numberTag");
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

    flyCardReserve(card: cc.Node, delay: number, numberTag: number, start: cc.Node): Promise<void> {
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

    openCard3(card: cc.Node, delay: number): Promise<void> {
        return new Promise((resolve) => {
            cc.tween(card)
                .delay(delay)
                .call(() => {
                    card.runAction(cc.rotateBy(0.5, this.isBanker ? 90 : -90).easing(cc.easeSineOut()));
                })
                .call(() => resolve())
                .start();
        });
    }

    async collectCards() {
        const worldPosition = this.cardsDrop.convertToWorldSpaceAR(cc.v2(0, 0));
        this.cards.forEach((card, index) => {
            const destPosition = card.parent.convertToNodeSpaceAR(worldPosition);
            this.dropCards(card, destPosition, index, 0.5);
        });
    }

    protected dropCards(cardNode: cc.Node, destPosition: cc.Vec2, index: number, durationJumpToBoxCard: number) {
        const cardComponent: BlockchainCard = cardNode.getComponentInChildren(BlockchainCard);
        return new Promise<void>((resolve) => {
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

    protected setPositionCardsAfterDrop(cardComponent: cc.Component, cardNode: cc.Node, index: number) {
        cardNode.position = this.cloneCardsPosition[index];
        cardComponent.node.children[0].position = cc.v3(0, 0, 0);
        cardComponent.node.children[0].scale = 0.5;
        cardComponent.node.children[0].skewX = 0;
        cardComponent.node.children[0].skewY = 0;
        cardComponent.node.children[0].opacity = 255;
        cardComponent.node.children[0].rotation = 0;
    }

    showCards(cards: any[], onFinishShowCards: () => void, playerHasCard3 = false): void {
        this.point.getComponent(cc.Label).string = "0";
        this.resetCard(this.cards[2]);
        let delayTime = 0;
        const hasCard3 = cards.length === 3;
        const handleCard = cc.sequence(
            cc.callFunc(() => {
                this.openCard(0, cards);
            }),
            cc.delayTime(this.openCardSecond), // Waiting for open 1st card
            cc.callFunc(() => {
                this.openCard(1, cards);
            }),
            cc.delayTime(this.openSecondCardSecond), // Waiting for open 2nd card
            cc.callFunc(() => {
                delayTime = this.openSecondCardSecond; // Waiting for the other side open 2nd card
                if (hasCard3) {
                    // delayTime = this.flyAndOpenCard3(cards, delayTime, playerHasCard3);
                }
                const handleFinishCard = cc.sequence(
                    cc.delayTime(delayTime),
                    cc.callFunc(() => onFinishShowCards && onFinishShowCards())
                );

                this.node.runAction(handleFinishCard);
            })
        );

        this.node.runAction(handleCard);
    }

    protected openCard(index: number, cards: any[], isAnimated = true) {
        if (index < cards.length) {
            const cardData = cards[index];
            const currentCard = this[`card${index + 1}`] as cc.Node;

            currentCard.active = false;
            if (cardData) {
                currentCard.active = true;
            }

            const newCard = currentCard.children[0].getComponent(BlockchainCard);
            newCard.setCardOldStyle({
                rank: cardData.card,
                suit: cardData.type
            });

            newCard.faceUp();
            if (index === 2 && !isAnimated && this.isMainPage) {
                const cardTemp = this.cards.find((tmp) => tmp.opacity !== 0);
                if (cardTemp) {
                    cardTemp.opacity = 0;
                }
            }
        }
    }
}
