const { ccclass, property } = cc._decorator;

@ccclass
export default class BaccaratCards extends cc.Component {
    @property(cc.Sprite)
    card1: cc.Sprite = null;

    @property(cc.Sprite)
    card2: cc.Sprite = null;

    @property(cc.Sprite)
    card3: cc.Sprite = null;

    private cardsResource: any = null;

    init(cardsResource) {
        this.cardsResource = cardsResource;
    }

    showCards(cards: any[]) {
        cards.forEach((card, index) => {
            if (card) {
                var currentCard = this["card" + (index + 1)] as cc.Sprite;
                currentCard.spriteFrame = this.cardsResource.getCard(card.card, card.type);
            }
        })
    }

    resetCards() {
        this.card1.spriteFrame
            = this.card2.spriteFrame
            = this.card3.spriteFrame
            = this.cardsResource.cardB1;
    }

}
