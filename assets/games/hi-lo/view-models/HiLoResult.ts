import NewCard, { CardModel } from "../../../common/new-card/view-models/NewCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoResult extends cc.Component {
    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    cardReel: cc.Node = null;

    private cardList: NewCard[] = [];
    private cardWidth = 118;
    private cardHeight = 150;
    private cardScaleX = 1.23;
    private cardScaleY = 1.5;
    private cardScaleZ = 1.23;
    private randomCardValues: CardModel[] = [
        { rank: "J", suit: 3 },
        { rank: "4", suit: 1 },
        { rank: "10", suit: 0 },
        { rank: "6", suit: 2 },
        { rank: "9", suit: 1 },
        { rank: "2", suit: 3 },
        { rank: "3", suit: 1 },
        { rank: "8", suit: 2 },
        { rank: "K", suit: 0 },
        { rank: "5", suit: 2 },
        { rank: "9", suit: 3 },
        { rank: "A", suit: 2 },
        { rank: "7", suit: 1 },
        { rank: "9", suit: 0 },
        { rank: "6", suit: 1 },
        { rank: "Q", suit: 0 },
        { rank: "6", suit: 2 },
        { rank: "Q", suit: 2 },
        { rank: "K", suit: 3 },
        { rank: "2", suit: 0 },
        { rank: "8", suit: 1 },
        { rank: "J", suit: 1 },
        { rank: "4", suit: 3 },
        { rank: "10", suit: 2 },
        { rank: "7", suit: 3 },
        { rank: "5", suit: 1 },
        { rank: "3", suit: 2 },
        { rank: "A", suit: 1 }
    ];

    onLoad() {
        this.createReel();
    }

    createReel() {
        this.cardReel && this.cardReel.destroyAllChildren();
        for (const card of this.randomCardValues) {
            const cardNode = this.createCard();
            this.cardReel.addChild(cardNode);
            const cardComp = cardNode.getComponent(NewCard);
            this.setCard(cardComp, card);
            this.cardList.push(cardComp);
        }
        this.cardReel.getComponent(cc.Layout).updateLayout();
    }

    createCard(): cc.Node {
        const node = cc.instantiate(this.cardPrefab);
        node.width = this.cardWidth;
        node.height = this.cardHeight;
        node.scaleX = this.cardScaleX;
        node.scaleY = this.cardScaleY;
        node.scaleZ = this.cardScaleZ;
        return node;
    }

    updateResult(result: CardModel) {
        const resultComp = this.cardList[this.cardList.length - 1];
        this.setCard(resultComp, result);
    }

    setCard(cardComponent: NewCard, data: CardModel) {
        cardComponent.setCard(data);
        cardComponent.faceUp();
    }

    faceDownCards() {
        this.cardList.forEach((card) => {
            card.faceDown();
        });
    }

    spin(spinDuration: number, animated: boolean) {
        this.cardList.forEach((card, index) => {
            card.faceUp();
        });
        const offset = this.cardReel.height - this.cardHeight * this.cardScaleY;
        if (animated) {
            this.cardReel.position = cc.v3(0, 0, 0);
            cc.tween(this.cardReel)
                .to(spinDuration, { position: cc.v3(this.cardReel.x, -offset, 0) }, { easing: "sineInOut" })
                .start();
        } else {
            this.cardReel.position = cc.v3(this.cardReel.x, -offset, 0);
        }
    }
}
