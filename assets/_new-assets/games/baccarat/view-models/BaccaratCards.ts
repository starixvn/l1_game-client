const { ccclass, property } = cc._decorator;

@ccclass
export default class BaccaratCards extends cc.Component {
    @property(cc.Sprite)
    card1: cc.Sprite = null;

    @property(cc.Sprite)
    card2: cc.Sprite = null;

    @property(cc.Sprite)
    card3: cc.Sprite = null;

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

    init(cardsResource) {
        this.cardsResource = cardsResource;
        this.resetCard(this.card3);
    }

    showCards(cards: any[], onFinishShowCards: () => void) {
        this.node.runAction(cc.sequence(
            cc.callFunc(() => { this.openCard(0, cards); }),
            cc.delayTime(0.5),
            cc.callFunc(() => { this.openCard(1, cards); }),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                let delayTime = 0;

                const hasCard3 = cards.length == 3;

                if (hasCard3) {
                    delayTime = this.flyAndOpenCard3(cards);
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

    resetCards() {
        this.point.node.active = false;
        this.point.string = '0';
        this.resetCard(this.card1);
        this.resetCard(this.card2);
        this.resetCard(this.card3);
        this.card3.node.active = false;
    }

    private setPoint(point: number) {
        this.point.node.active = true;
        const currentPoint = parseInt(this.point.string);
        this.point.string = ((currentPoint + point) % 10).toString();
    }

    private flyAndOpenCard3(cards: any[]) {
        let delayTime = 0;
        let card = this.card3;
        card.node.active = true;

        if (!this.isBanker) {
            this.flyCard(card.node, -90);
            delayTime = this.flyCardSecond;
        }
        else {
            this.node.runAction(cc.sequence(
                cc.delayTime(this.flyCardSecond + this.openCardSecond),
                cc.callFunc(() => this.flyCard(card.node, 90)),
                cc.delayTime(this.flyCardSecond)));

            delayTime = this.flyCardSecond + 1;
        }

        delayTime += 0.2;

        this.node.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(() => {
            this.openCard(2, cards);
        })));

        delayTime += this.openCardSecond;

        return delayTime;
    }

    private flyCard(card: cc.Node, angle: number = 0) {
        const cardPosition = card.position;
        card.position = this.cardsBox.position;
        card.opacity = 255;

        card.runAction(cc.spawn(
            cc.rotateTo(this.flyCardSecond, angle).easing(cc.easeInOut(2)),
            cc.scaleTo(this.flyCardSecond, 1).easing(cc.easeInOut(2)),
            cc.moveTo(this.flyCardSecond, cardPosition).easing(cc.easeInOut(2))));
    }

    private resetCard(card: cc.Sprite) {
        card.spriteFrame = this.cardsResource.cardB1;
        card.node.opacity = 0;
        card.node.scale = 0.5;
        card.node.angle = -135;
    }

    private openCard(index: number, cards: any[]) {
        if (index < cards.length) {
            var cardData = cards[index];
            var currentCard = this["card" + (index + 1)] as cc.Sprite;
            currentCard.spriteFrame = this.cardsResource.getCard(cardData.card, cardData.type);

            currentCard.node.scaleX = 0;
            currentCard.node.runAction(cc.scaleTo(this.openCardSecond, 1, 1));
            const point: number = cardData.card + 1;
            this.setPoint(point >= 10 ? 0 : point);
        }
    }
}
