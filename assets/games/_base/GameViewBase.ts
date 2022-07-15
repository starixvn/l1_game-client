import BaseComponent from "../../common/BaseComponent";
import MiniPanel from "../../mini-games-panel/view-models/MiniPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameViewBase extends BaseComponent {
    public currentMiniPanel: MiniPanel;
    initMiniPanel(miniPanel: MiniPanel) {
        this.currentMiniPanel = miniPanel;
    }

    openGame() {
        this.node.active = true;
    }
}
