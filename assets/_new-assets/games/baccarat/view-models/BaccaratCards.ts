const { ccclass, property } = cc._decorator;

@ccclass
export default class BaccaratCards extends cc.Component {
    @property(cc.Sprite)
    card1: cc.Sprite = null;

    @property(cc.Sprite)
    card2: cc.Sprite = null;

    @property(cc.Sprite)
    card3: cc.Sprite = null;

    @property(cc.Sprite)
    cardBack: cc.Sprite = null;

    @property(cc.Node)
    otherCard: cc.Node = null;

    @property
    flyX: number = 0;

    @property
    isBanker: boolean = false;

    @property(cc.Node)
    cardsBox: cc.Node = null;

    @property(cc.Label)
    point: cc.Label = null;

    private cardsResource: any = null;
    private readonly flyCardSecond = 0.8;
    private readonly openCardSecond = 0.3;
    private readonly openSecondCardSecond = 1.2;
    private readonly setPointSecond = 0.2;

    init(cardsResource, resetCard3 = true) {
        this.cardsResource = cardsResource;
        resetCard3 && this.resetCard(this.card3);
    }

    resetCards() {
        this.point.node.parent.active = false;
        this.point.string = '0';
        this.resetCard(this.card1);
        this.resetCard(this.card2);
        this.resetCard(this.card3);
        this.card3.node.active = false;
    }

    showCardsWithoutAnimation(cards: any[]) {
        this.openCard(0, cards, false);
        this.openCard(1, cards, false);
        // const hasCard3 = this.openCard(2, cards, false);
        // this.otherCard && (this.otherCard.active = hasCard3);
    }

    showCards(cards: any[], onFinishShowCards: () => void, playerHasCard3: boolean = false): void {
        this.node.runAction(cc.sequence(
            cc.callFunc(() => { this.openCard(0, cards); }),
            cc.delayTime(this.openCardSecond), // Waiting for open 1st card
            cc.callFunc(() => { this.openCard2(cards); }),
            cc.delayTime(this.openSecondCardSecond), // Waiting for open 2nd card
            cc.callFunc(() => {
                let delayTime = this.openSecondCardSecond; // Waiting for the other side open 2nd card
                const hasCard3 = cards.length == 3;

                if (hasCard3) {
                    delayTime = this.flyAndOpenCard3(cards, delayTime, playerHasCard3);
                }

                this.node.runAction(cc.sequence(
                    cc.delayTime(delayTime),
                    cc.callFunc(() => onFinishShowCards && onFinishShowCards())))
            })
        ))
    }

    flyFirstCard() {
        this.flyCard(this.card1.node);
    }

    flySecondCard() {
        this.flyCard(this.card2.node);
    }

    private setPoint(point: number) {
        this.point.node.active = true;
        this.point.node.parent.active = true;

        const currentPoint = parseInt(this.point.string);
        this.point.node.parent.runAction(
            cc.sequence(
                cc.scaleTo(this.setPointSecond, 1.1, 1.1),
                cc.scaleTo(this.setPointSecond, 1, 1)
            )
        )

        this.point.string = ((currentPoint + point) % 10).toString();
    }

    private openCard2(cards: any[]) {
        if (this.isBanker) {
            this.node.runAction(cc.sequence(
                cc.delayTime(this.openSecondCardSecond), // Waiting for player open 2nd card
                cc.callFunc(() => {
                    this.openCard(1, cards);
                })));
        }
        else {
            this.openCard(1, cards);
        }
    }

    private flyAndOpenCard3(cards: any[], delayTime: number, playerHasCard3: boolean) {
        let card = this.card3;
        card.node.active = true;

        if (this.isBanker) {
            if (playerHasCard3) {
                delayTime += this.flyCardSecond + this.openSecondCardSecond; // Waiting for player open 3rd card
            }

            this.node.runAction(cc.sequence(
                cc.delayTime(delayTime),
                cc.callFunc(() => this.flyCard(card.node, 0))));
        }
        else {
            this.node.runAction(cc.sequence(
                cc.delayTime(delayTime),
                cc.callFunc(() => this.flyCard(card.node, 0))));
        }

        delayTime += this.flyCardSecond;
        delayTime += 0.2; // Buffer time after the flight

        this.node.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.callFunc(() => { this.openCard(2, cards); })));

        delayTime += this.openSecondCardSecond;

        return delayTime;
    }

    private flyCard(card: cc.Node, angle: number = 0) {
        const cardPosition = card.position;
        card.position = this.cardsBox.position;
        card.opacity = 255;

        card.runAction(cc.spawn(
            cc.rotateTo(this.flyCardSecond, angle).easing(cc.easeInOut(2)),
            cc.scaleTo(this.flyCardSecond, 1).easing(cc.easeInOut(2)),
            cc.moveTo(this.flyCardSecond, cardPosition).easing(cc.easeInOut(2)),
        ));

        card.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(() => this.cardsResource.playGetCardAudio())));
    }

    private resetCard(card: cc.Sprite) {
        card.spriteFrame = this.cardsResource.cardB1;
        card.node.opacity = 0;
        card.node.scale = 0.5;
        card.node.angle = -135;
    }

    private openCard(index: number, cards: any[], isAnimated = true) {
        if (index < cards.length) {
            let delayTime = 0;
            const cardData = cards[index];
            const currentCard = this["card" + (index + 1)] as cc.Sprite;

            if (!cardData) {
                currentCard.node.active = false;
            }

            currentCard.node.active = true;
            currentCard.spriteFrame = this.cardsResource.getCard(cardData.card, cardData.type);

            if (isAnimated) {
                if (index == 0) { // 1st card
                    currentCard.node.scaleX = 0;
                    currentCard.node.runAction(
                        cc.scaleTo(this.openCardSecond, 1, 1));
                    delayTime += this.openCardSecond;
                }
                else {
                    this.cardBack.node.active = true;
                    const position = cc.v2(currentCard.node.position.x - currentCard.node.width / 2, currentCard.node.position.y - currentCard.node.height / 2);
                    this.cardBack.node.position = position;

                    this.cardBack.node.runAction(cc.sequence(
                        // cc.rotateTo(0.4, 10).easing(cc.easeSineOut()),
                        // cc.rotateTo(0.4, 0).easing(cc.easeSineOut()),
                        cc.delayTime(0.4),
                        cc.moveBy(0.4, cc.v2(5, -5)).easing(cc.easeSineOut()),
                        cc.spawn(
                            cc.moveBy(0.4, cc.v2(200, -200)).easing(cc.easeExponentialInOut()),
                            cc.fadeOut(0.4).easing(cc.easeExponentialInOut())
                        ),
                        cc.callFunc(() => {
                            this.cardBack.node.active = false;
                            this.cardBack.node.opacity = 255;
                        })
                    ))

                    delayTime += this.openSecondCardSecond;
                }

                if (index == 2) { // 3rd card
                    currentCard.node.runAction(
                        cc.sequence(
                            cc.delayTime(delayTime),
                            cc.rotateBy(0.5, this.isBanker ? 270 : -270).easing(cc.easeSineOut())
                        )
                    )
                }
            }

            if (this.point) {
                const point: number = cardData.card + 1;

                currentCard.node.runAction(cc.sequence(
                    cc.delayTime(delayTime),
                    cc.callFunc(() => this.setPoint(point >= 10 ? 0 : point))
                ));
            }
        }
    }
}
