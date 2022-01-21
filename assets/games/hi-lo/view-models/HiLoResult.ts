import NewCard from "../../../common/new-card/view-models/NewCard";

const { ccclass, property } = cc._decorator;

export interface CardModel {
    rank: string;
    suit: number;
}

@ccclass
export default class HiLoResult extends cc.Component {
    @property(cc.Node)
    animation: cc.Label = null;

    @property(cc.Node)
    cardContainer: cc.Node = null;

    @property(cc.Node)
    cardBack: cc.Node = null;

    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    protected cardComponent: NewCard;

    onLoad() {
        const card = cc.instantiate(this.cardPrefab);
        this.cardComponent = card.getComponent(NewCard);
        this.cardContainer.addChild(card);
    }

    setResult(data: CardModel) {
        this.cardComponent.setCard(data);
        this.cardComponent.faceUp();
    }

    resetNewRound() {
        this.cardBack.active = true;
        this.cardComponent.faceDown();
    }
}
