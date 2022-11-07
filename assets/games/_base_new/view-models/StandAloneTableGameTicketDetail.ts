import CommonDialog from "../../../common/_base/view-models/CommonDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandAloneTableGameTicketDetail extends cc.Component {
    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    onLoad() {
        this.commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
    }
    setData(data: any) {}
}
