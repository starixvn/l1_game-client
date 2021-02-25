import PresetBet from "../../../../common/preset-bet/view-models/PresetBet";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoPresetBet extends PresetBet {
    @property(cc.Node)
    main: cc.Node = null;

    onLoad() {
        this.commonDialog = this.main.getComponent("CommonDialog");
        this.commonDialog.onDidHide = () => {
            this.node.active = false;
        };
        this.commonDialog.onWillShow = () => {
            this.node.active = true;
        };
        this.updateItems();
    }
}
