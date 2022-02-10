import NewCard, { CardModel } from "../../../common/new-card/view-models/NewCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoStatistic extends cc.Component {
    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    statisticContainer: cc.Node = null;

    cardList: NewCard[] = [];

    onLoad() {
        this.clearCards();
    }

    clearCards() {
        // this.statisticContainer.destroyAllChildren();
    }

    updateCards(cards: CardModel[]) {
        if (this.statisticContainer.childrenCount == cards.length - 1) {
            const cardNode = this.createCard(cards[cards.length - 1]);
            cc.tween(cardNode).to(0.3, { opacity: 255 }, { easing: "sineInOut" }).start();
        } else {
            this.clearCards();
            cards.forEach((card) => {
                const cardNode = this.createCard(card);
                cardNode.opacity = 255;
            });
        }
    }

    createCard(card: CardModel): cc.Node {
        const cardNode = cc.instantiate(this.cardPrefab);
        cardNode.width = 118;
        cardNode.height = 142;
        cardNode.opacity = 0;
        this.statisticContainer.addChild(cardNode);
        const cardComp = cardNode.getComponent(NewCard);
        cardComp.setCard(card);
        cardComp.faceUp();
        this.cardList.push(cardComp);

        return cardNode;
    }
}
