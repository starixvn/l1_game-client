import NewCard, { CardModel } from "../../../common/new-card/view-models/NewCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoStatistic extends cc.Component {
    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    statisticContainer: cc.Node = null;

    @property(cc.ScrollView)
    statsScrollView: cc.ScrollView = null;

    private cardList: NewCard[] = [];
    private itemSize = 10;
    private cardWidth = 118;
    private cardHeight = 142;

    onLoad() {
        this.clearCards();
    }

    clearCards() {
        this.statisticContainer.destroyAllChildren();
        this.cardList = [];
    }

    updateCards(cards: CardModel[]) {
        if (this.statisticContainer.childrenCount == cards.length - 1) {
            const cardNode = this.createCard(cards[cards.length - 1]);
            cc.tween(cardNode).to(0.3, { opacity: 255 }, { easing: "sineInOut" }).start();
            if (this.cardList.length > this.itemSize) {
                const offsetX = this.statisticContainer.position.x - this.cardWidth;
                this.updateContentPosition(offsetX);
            }
        } else {
            this.clearCards();
            cards.forEach((card) => {
                const cardNode = this.createCard(card);
                cardNode.opacity = 255;
            });
            this.statisticContainer.getComponent(cc.Layout).updateLayout();
            if (this.cardList.length > this.itemSize) {
                const offsetX = this.statisticContainer.position.x - (this.cardList.length - this.itemSize) * this.cardWidth;
                this.updateContentPosition(offsetX);
            }
        }
    }

    protected updateContentPosition(offsetX: number) {
        // cc.tween(this.statisticContainer)
        //     .to(
        //         0.3,
        //         { position: cc.v3(offsetX, this.statisticContainer.position.y, this.statisticContainer.position.z) },
        //         { easing: "sineOut" }
        //     )
        //     .start();
        this.statisticContainer.position = cc.v3(offsetX, this.statisticContainer.position.y, this.statisticContainer.position.z);
    }

    createCard(card: CardModel): cc.Node {
        const cardNode = cc.instantiate(this.cardPrefab);
        cardNode.width = this.cardWidth;
        cardNode.height = this.cardHeight;
        cardNode.opacity = 0;
        cardNode.scaleX = 0.36;
        cardNode.scaleY = 0.4;
        this.statisticContainer.addChild(cardNode);
        const cardComp = cardNode.getComponent(NewCard);
        cardComp.setCard(card);
        cardComp.faceUp();
        this.cardList.push(cardComp);

        return cardNode;
    }
}
