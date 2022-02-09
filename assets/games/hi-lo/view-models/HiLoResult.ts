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

    private resultCardComp: NewCard;
    private animationCards: NewCard[] = [];
    private animationCardValues: CardModel[] = [
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
        this.animationCards.forEach((card, index) => {
            card.faceUp();
        });

        if (animated) {
            cc.tween(this.cardReel)
                .call(() => {
                    this.randomContainer.opacity = 255;
                    this.randomContainer.position = cc.v3(0, 0, 0);
                    const offset = this.randomContainer.height;
                    this.resultContainer.position = cc.v3(0, this.resultContainer.height, 0);
                    cc.tween(this.randomContainer)
                        .to(spinDuration, { position: cc.v3(this.randomContainer.x, -offset, 0) }, { easing: "sineOut" })
                        .start();
                })
                .delay((spinDuration / this.animationCards.length) * (this.animationCards.length - 2.32))
                .call(() => {
                    cc.tween(this.resultContainer)
                        .to(
                            spinDuration / this.animationCards.length,
                            { position: cc.v3(this.resultContainer.x, 0, 0) },
                            { easing: "sineIn" }
                        )
                        .start();
                })
                .start();
        } else {
            this.resultContainer.position = cc.v3(0, 0, 0);
        }
    }
}
