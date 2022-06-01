import * as _ from "lodash";
import GameUtils from "../../../../common/GameUtils";
import CommonDialog from "../../../../common/_base/view-models/CommonDialog";
import { CardModel } from "../../BlockchainBaccaratType";
import { BlockchainBaccarat } from "../../event-models/BlockchainBaccaratCardListModel";
import CardChain from "./CardChain";

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
        const { chain } = cardList;
        const itemsNode = GameUtils.createNodeFromPrefab(this.itemsPrefab);
        this.items = itemsNode.children;
        this.cards.forEach((dot) => {
            dot.removeFromParent();
            dot.destroy();
        });

        this.cards = [];

        this.nextMark = null;

        chain.forEach((card) => {
            const historyDot = this.createCard(card.card, 1, 1);
            this.content.addChild(historyDot);
            this.cards.push(historyDot);
        });

        this.addNextMark();
    }

    protected createCard(card: CardModel, scaleX: number, scaleY: number, isFaceUp = true): cc.Node {
        const node = cc.instantiate(this.itemsPrefab);
        const cardComponent = node.getComponent(CardChain);
        cardComponent.setCardOldStyle({
            rank: card?.value,
            suit: card?.suit
        });
        cardComponent.setFaceUp(isFaceUp);
        node.scaleX = scaleX;
        node.scaleY = scaleY;
        return node;
    }

    private addNextMark() {
        const dot = cc.instantiate(this.itemNext);
        dot.active = false;
        this.content.addChild(dot);
        this.nextMark = dot;
        this.cards.push(dot);
    }
}
