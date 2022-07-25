import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import { SedieId } from "../../sedie/view-models/Sedie";

const { ccclass } = cc._decorator;

@ccclass
export default class LuckyWheelBanner extends cc.Component {
    private miniPanel: MiniPanel;

    onLoad() {
        this.miniPanel = cc.RedT.MiniPanel;
    }

    openSedie() {
        const dialog = this.node.getComponent(CommonDialog);
        dialog.closeDialog();
        this.miniPanel.openNewSocketTableGame(null, SedieId);
    }

    onDisable() {
        this.node.destroy();
    }
}
