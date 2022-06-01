import * as _ from "lodash";
import GameUtils from "../../../../common/GameUtils";
import CommonDialog from "../../../../common/_base/view-models/CommonDialog";
import { BlockchainBaccarat } from "../../event-models/BlockchainBaccaratCardListModel";

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
    itemSize: cc.Size = new cc.Size(120, 240);

    @property(cc.Size)
    padding: cc.Size = new cc.Size(2, 2);

    items: cc.Node[];
    cards: cc.Node[] = [];

    nextMark: cc.Node = null;

    onLoad() {
        const itemsNode = GameUtils.createNodeFromPrefab(this.itemsPrefab);
        this.items = itemsNode.children;
        console.log("ahihi", this.items);
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
        console.log("cardlist", cardList);
        console.log("card chain", this.items);
        this.cards.forEach((dot) => {
            dot.removeFromParent();
            dot.destroy();
        });

        this.cards = [];

        this.nextMark = null;

        chain.forEach((card) => {
            const cardItem = _.find(this.items, (item) => item.name.toLowerCase() === "card");
            const historyDot = cc.instantiate(cardItem);
            this.content.addChild(historyDot);
            this.cards.push(historyDot);
        });

        this.addNextMark();
    }

    private addNextMark() {
        const dot = cc.instantiate(this.itemNext);
        dot.active = false;
        this.content.addChild(dot);
        this.nextMark = dot;
        this.cards.push(dot);
    }
}
