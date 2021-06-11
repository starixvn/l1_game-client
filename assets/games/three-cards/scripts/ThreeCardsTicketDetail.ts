import NewCard from "../../../common/new-card/view-models/NewCard";
import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import { ThreeCardsBetData } from "./DataDefinition";
import ThreeCardsTicketDetailItem from "./ThreeCardsTicketDetailItem";
import ThreeCardsWinChoiceView from "./ThreeCardsWinChoiceView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ThreeCardsTicketDetail extends cc.Component {
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property({ type: NewCard })
    cards: NewCard[] = [];

    @property(cc.Label)
    round: cc.Label = null;

    @property(ThreeCardsWinChoiceView)
    winChoices: ThreeCardsWinChoiceView = null;

    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    onLoad() {
        this.commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    setData(data: ThreeCardsBetData) {
        this.round.string = data.phien;
        this.cards.forEach((card, i) => {
            card.setCard(data.result[i]);
            card.faceUp();
        });
        this.winChoices.setData(data);
        this.createDetailItems(data);
    }

    createDetailItems(data: ThreeCardsBetData) {
        const keys = ["red", "black", "diamonds", "hearts", "spades", "clubs"];
        const list = [];
        keys.forEach((key) => {
            if (data[key] > 0) {
                list.push(key);
            }
        });

        const { settlementResult } = data;
        list.forEach((key, i) => {
            const item = this.addItem();
            const itemData = {
                choice: key,
                bet: data[key],
                odds: data.odds[key]
            };
            item.setData(itemData);
            item.showBackground(i % 2 !== 0);
            item.setHighlight(settlementResult[key]);
        });
    }

    addItem(): ThreeCardsTicketDetailItem {
        const node = cc.instantiate(this.itemPrefab);
        this.content.addChild(node);
        return node.getComponent(ThreeCardsTicketDetailItem);
    }
}
