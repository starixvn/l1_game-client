import VipSedieWarTicketDetailItem from "./VipSedieWarTicketDetailItem";

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



    onLoad() {
        const commonDialog = this.mainFrame.getComponent('CommonDialog');
        commonDialog.onDidHide = () => { this.node.destroy(); };
    }

    setData(data: any) {
        this.content.destroyAllChildren();

        this.roundId.string = data.phien;
        this.winChoices.string = data.winChoices;
        const details = data.betLogDetails;
        details.forEach(detail => {
            const item = this.addItem();
            item.setData(detail);
        })
    }

    addItem(): VipSedieWarTicketDetailItem {
        const node = cc.instantiate(this.itemPrefab);
        this.content.addChild(node);
        return node.getComponent(VipSedieWarTicketDetailItem);
    }
}
