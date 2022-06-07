import * as _ from "lodash";
import GameUtils from "../../../../common/GameUtils";
import CommonDialog from "../../../../common/_base/view-models/CommonDialog";
import { CardModel } from "../../BlockchainBaccaratType";
import { BlockchainBaccarat } from "../../event-models/BlockchainBaccaratCardListModel";
import BlockchainCard from "./BlockchainCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainCardList extends cc.Component {
    @property({ type: cc.Prefab })
    itemsPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    itemNext: cc.Node = null;

    @property({ type: cc.Integer })
    rowMax = 35;

    @property(cc.Size)
    itemSize: cc.Size = new cc.Size(100, 120);

    @property(cc.Size)
    padding: cc.Size = new cc.Size(2, 2);

    items: cc.Node[];
    cards: cc.Node[] = [];

    nextMark: cc.Node = null;

    onLoad() {
        const itemsNode = GameUtils.createNodeFromPrefab(this.itemsPrefab);
        this.items = itemsNode.children;
    }

    showDialog() {
        const commonDialog = this.getComponent(CommonDialog);
        if (commonDialog) {
            commonDialog.showDialog();
        }
    }

    public setData(cardList: BlockchainBaccarat) {
        const { chain, burnedCards, cutCardIndex, currentIndex } = cardList;
        const itemsNode = GameUtils.createNodeFromPrefab(this.itemsPrefab);
        this.items = itemsNode.children;
        this.cards.forEach((card) => {
            card.removeFromParent();
            card.destroy();
        });

        this.cards = [];

        this.nextMark = null;
        chain.forEach((card, index) => {
            const historyDot = this.createCard(card.card, index + 1);
            this.content.addChild(historyDot);
            this.cards.push(historyDot);
            index++;
        });

        this.addNextMark();
    }

    protected createCard(card: CardModel, index, isFaceUp = true): cc.Node {
        const node = cc.instantiate(this.itemsPrefab);
        const cardComponent = node.getComponent(BlockchainCard);
        cardComponent.setCardOldStyle({
            rank: card?.rank,
            suit: card?.suit
        });
        !!card ? cardComponent.setFaceUp(isFaceUp) : cardComponent.setFaceUp(!isFaceUp);
        cardComponent.indexNumber.string = this.convertIndexNumber(index);
        return node;
    }

    private addNextMark() {
        const card = cc.instantiate(this.itemNext);
        card.active = false;
        this.content.addChild(card);
        this.nextMark = card;
        this.cards.push(card);
    }

    private convertIndexNumber(index: number) {
        switch (true) {
            case index < 10:
                return `00${index}`;
            case index < 100:
                return `0${index}`;
            default:
                return index.toString();
        }
    }
}
