import NewCard, { CardModel } from "../../../common/new-card/view-models/NewCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoResult extends cc.Component {
    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    cardReel: cc.Node = null;

    @property(cc.Node)
    randomContainer: cc.Node = null;

    @property(cc.Node)
    resultContainer: cc.Node = null;

    private itemHeight = 0;
    private resultCardComp: NewCard;
    private animationCards: NewCard[] = [];
    private animationCardValues: CardModel[] = [
        { rank: "3", suit: 1 },
        { rank: "8", suit: 2 },
        { rank: "K", suit: 0 },
        { rank: "5", suit: 2 },
        { rank: "9", suit: 3 },
        { rank: "A", suit: 2 },
        { rank: "7", suit: 1 },
        { rank: "9", suit: 0 },
        { rank: "6", suit: 1 },
        { rank: "Q", suit: 0 }
    ];

    onLoad() {
        this.createReel();
    }

    createReel() {
        this.createRandomCards();
        this.createResultCard();
        const reelLayout = this.cardReel.getComponent(cc.Layout);
        reelLayout.updateLayout();
        reelLayout.enabled = false;
        console.log(this.cardReel.height);
    }

    updateResult(result: CardModel) {
        this.setCard(this.resultCardComp, result);
    }

    createRandomCards() {
        this.randomContainer && this.randomContainer.destroyAllChildren();
        for (const card of this.animationCardValues) {
            const cardNode = this.createCard();
            this.randomContainer.addChild(cardNode);
            this.itemHeight = cardNode.height * cardNode.scaleY;
            const cardComp = cardNode.getComponent(NewCard);
            cardComp.faceDown();
            this.setCard(cardComp, card);
            this.animationCards.push(cardComp);
        }
        const randomLayout = this.randomContainer.getComponent(cc.Layout);
        randomLayout.updateLayout();
        randomLayout.enabled = false;
    }

    createResultCard() {
        this.resultContainer && this.resultContainer.destroyAllChildren();
        const card = this.createCard();
        this.resultCardComp = card.getComponent(NewCard);
        this.resultContainer.addChild(card);
    }

    createCard(): cc.Node {
        const node = cc.instantiate(this.cardPrefab);
        node.width = 118;
        node.height = 150;
        node.scaleX = 1.23;
        node.scaleY = 1.5;
        node.scaleZ = 1.23;
        return node;
    }

    setCard(cardComponent: NewCard, data: CardModel) {
        cardComponent.setCard(data);
        cardComponent.faceUp();
    }

    faceDownCards() {
        this.animationCards.forEach((card) => {
            card.faceDown();
        });
        this.resultCardComp.faceDown();
    }

    spin(spinDuration: number, animated: boolean) {
        this.cardReel.position = cc.v3(0, 0, 0);
        this.animationCards.forEach((card, index) => {
            card.faceUp();
        });

        const offset = -(this.cardReel.height - this.itemHeight);
        if (animated) {
            cc.tween(this.cardReel)
                .call(() => {
                    this.animationCards[this.animationCards.length - 1].faceUp();
                })
                .to(spinDuration, { position: cc.v3(this.cardReel.x, offset, 0) }, { easing: "sineIn" })
                .start();
        } else {
            this.cardReel.position = cc.v3(this.cardReel.x, offset, 0);
        }
    }
}
