import NewCard, { CardModel } from "../../../common/new-card/view-models/NewCard";
import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoStatistic extends cc.Component {
    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    statisticContainer: cc.Node = null;

    @property(cc.ScrollView)
    statsScrollView: cc.ScrollView = null;

    @property(cc.Node)
    highlight: cc.Node = null;

    private layout: cc.Layout;
    private spaceX: number;
    private containerPosX;
    private readonly itemSize = 10;
    private readonly cardWidth = 118;
    private readonly cardHeight = 142;
    private readonly cardScaleX = 0.36;
    private readonly cardScaleY = 0.4;

    onLoad() {
        this.layout = this.statisticContainer.getComponent(cc.Layout);
        this.spaceX = this.layout.spacingX;
    }

    onEnable() {
        this.statisticContainer.getComponent(cc.Widget).left = 0;
        this.containerPosX = this.statisticContainer.position.x;
    }

    clearCards() {
        this.statisticContainer.destroyAllChildren();
    }

    updateCards(cards: CardModel[]) {
        if (this.statisticContainer.childrenCount === 0) {
            cards.forEach((card) => {
                this.createCard(card);
            });
        } else {
            this.createCard(cards[cards.length - 1]);
        }

        if (cards.length > this.itemSize) {
            this.updateContentPosition(this.getOffsetX(cards.length - this.itemSize));
        }

        this.layout && this.layout.updateLayout();
    }

    private getOffsetX(itemNumbers: number): number {
        return this.containerPosX - itemNumbers * this.cardWidth * this.cardScaleX - itemNumbers * this.spaceX;
    }

    protected updateContentPosition(offsetX: number) {
        cc.tween(this.statisticContainer)
            .to(
                0.3,
                { position: cc.v3(offsetX, this.statisticContainer.position.y, this.statisticContainer.position.z) },
                { easing: "sineOut" }
            )
            .start();
    }

    createCard(card: CardModel): cc.Node {
        const cardNode = cc.instantiate(this.cardPrefab);
        cardNode.width = this.cardWidth;
        cardNode.height = this.cardHeight;
        cardNode.scaleX = this.cardScaleX;
        cardNode.scaleY = this.cardScaleY;
        this.statisticContainer.addChild(cardNode);
        const cardComp = cardNode.getComponent(NewCard);
        cardComp.setCard(card);
        cardComp.faceUp();

        return cardNode;
    }
}
