import VipSedieWarTicketDetailItem from "./VipSedieWarTicketDetailItem";
import VipSedieWarUtils from "./VipSedieWarUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipSedieWarTicketDetail extends cc.Component {
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    winChoices: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    @property(cc.Node)
    playerResultNode: cc.Node = null;

    @property(cc.Node)
    bankerResultNode: cc.Node = null;

    @property({ type: cc.SpriteFrame })
    dotsFrame: cc.SpriteFrame[] = [];

    onLoad() {
        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    setData(data: any) {
        this.roundId.string = data.phien;
        this.winChoices.string = this.getWinChoices(data.settlementResult);

        VipSedieWarUtils.setDotsImage(data.result, this.playerResultNode, this.bankerResultNode, this.dotsFrame);

        const details = data.betLogDetails;
        details.forEach((detail) => {
            const item = this.addItem();
            item.setData(detail);
            item.setHighlightWinChoice(data.settlementResult[detail.choice]);
        });
    }

    getWinChoices(settlementResult: any): string {
        const row1 = ["player", "banker", "tie", "even", "odd"];
        const row2 = ["playerEven", "playerOdd", "bankerEven", "bankerOdd"];
        const row3 = [
            "playerRed4",
            "playerRed3",
            "playerWhite3",
            "playerWhite4",
            "bankerRed4",
            "bankerRed3",
            "bankerWhite3",
            "bankerWhite4"
        ];

        const winChoices1 = [];
        Object.keys(row1).forEach((key) => {
            if (settlementResult[row1[key]]) {
                winChoices1.push(VipSedieWarUtils.getBetChoiceString(row1[key]));
            }
        });
        const winChoices2 = [];
        Object.keys(row2).forEach((key) => {
            if (settlementResult[row2[key]]) {
                winChoices2.push(VipSedieWarUtils.getBetChoiceString(row2[key]));
            }
        });
        const winChoices3 = [];
        Object.keys(row3).forEach((key) => {
            if (settlementResult[row3[key]]) {
                winChoices3.push(VipSedieWarUtils.getBetChoiceString(row3[key]));
            }
        });

        let winChoices: string;
        if (winChoices3.length > 0) {
            winChoices = `${winChoices1.join(", ")}\n${winChoices2.join(", ")}\n${winChoices3.join(", ")}`;
        } else {
            winChoices = `${winChoices1.join(", ")}\n${winChoices2.join(", ")}`;
        }
        return winChoices;
    }

    addItem(): VipSedieWarTicketDetailItem {
        const node = cc.instantiate(this.itemPrefab);
        this.content.addChild(node);
        return node.getComponent(VipSedieWarTicketDetailItem);
    }
}
