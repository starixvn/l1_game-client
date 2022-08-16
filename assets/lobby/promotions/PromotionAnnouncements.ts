import CommonDialog from "../../common/_base/view-models/CommonDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PromotionAnnouncements extends cc.Component {
    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.Label)
    label: cc.Label = null;

    text = "hello";

    showDialog() {
        if (this.commonDialog) {
            this.commonDialog.showDialog();
        }
    }
}
