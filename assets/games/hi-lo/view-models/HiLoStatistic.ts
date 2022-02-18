import { CardModel } from "../../../common/new-card/view-models/NewCard";
import HiLoCard from "../components/view-models/HiLoCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoStatistic extends cc.Component {
    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    statisticContainer: cc.Node = null;

    @property(cc.ScrollView)
    statsScrollView: cc.ScrollView = null;

    private layout: cc.Layout;
    private spaceX: number;
    private containerPosX: number;
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
        this.clearCards();
        cards.forEach((card) => {
            this.createCard(card);
        });

        this.updatePositionHighlight();

        if (cards.length > this.itemSize) {
            this.updateContentPosition(this.getOffsetX(cards.length - this.itemSize));
        }

        this.layout && this.layout.updateLayout();
    }

    updatePositionHighlight() {
        const cardComps = this.statisticContainer.getComponentsInChildren(HiLoCard);
        cardComps.forEach((comp, index) => {
            comp.highlight.active = false;
            if (index === cardComps.length - 1) {
                comp.highlight.active = true;
            }
        });
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
        const cardComp = cardNode.getComponent(HiLoCard);
        cardComp.setCard(card);
        cardComp.faceUp();

        return cardNode;
    }
}
