import SafeDraggableItem from "../../../common/draggable-layout/view-models/SafeDraggableItem";
import { GameIds } from "../../../configs/SabaConfigs";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckyWheelIcon extends SafeDraggableItem {
    @property(cc.Prefab)
    luckyWheelPrefab: cc.Prefab = null;

    private miniPanel: MiniPanel;

    init(main: MiniPanel) {
        this.miniPanel = main;
    }

    onLoad() {
        super.onLoad();
        if (!cc.sys.isMobile) {
            this.node.scale = 0.75;
        }

        this.touchCallback.end = (isClicked) => {
            if (isClicked) {
                this.openGame();
            }
        };
    }

    openGame() {
        this.miniPanel.openNewSocketMiniGame(null, GameIds.LuckyWheel);
    }
}
