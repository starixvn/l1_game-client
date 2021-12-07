import CommonDialog from "../../../../common/_base/view-models/CommonDialog";
import PresetBet from "../../../../common/preset-bet/view-models/PresetBet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoPresetBet extends PresetBet {
    @property(cc.Node)
    main: cc.Node = null;

    onLoad() {
        this.commonDialog = this.main.getComponent(CommonDialog);
        this.commonDialog.addOnDidHide(() => {
            this.node.active = false;
        });
        this.commonDialog.addOnWillShow(() => {
            this.node.active = true;
        });
    }
}
