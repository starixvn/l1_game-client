import PresetBet from "../../../../common/preset-bet/view-models/PresetBet";

const { ccclass } = cc._decorator;

@ccclass
export default class MiniKenoPresetBet extends PresetBet {
    onLoad() {
        super.onLoad();
        this.commonDialog.onDidHide = () => {
            this.node.active = false;
        };
        this.commonDialog.onWillShow = () => {
            this.node.active = true;
        };
    }
}
