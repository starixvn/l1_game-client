import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import { games } from "../../../SabaConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckyWheelBanner extends cc.Component {

    private miniPanel: MiniPanel;

    onLoad() {
        this.miniPanel = cc.RedT.MiniPanel;
    }

    openSedie() {
        const dialog = this.node.getComponent("CommonDialog");
        dialog.closeDialog();
        this.miniPanel.openNewGameSocket(null, games.XocXoc.id);
    }

    onDisable() {
        this.node.destroy();
    }
}
