import StandAloneTableGameBase from "../../_base_new/view-models/StandAloneTableGameBase";
import StandAloneTableGameHistory from "../../_base_new/view-models/StandAloneTableGameHistory";
import FantanBowlAnimation from "./FantanBowlAnimation";
import { FantanConfig, FantanId } from "./FantanConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Fantan extends StandAloneTableGameBase {
    animation: FantanBowlAnimation = null;

    constructor() {
        super();
        this.gameId = FantanId;
        this.setConfig(FantanConfig);
    }

    initBowlAnimation(node) {
        const animation = node.getComponent(FantanBowlAnimation);
        if (animation) {
            this.animation = animation;
        }
    }
    openHistory() {
        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(StandAloneTableGameHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.addDialog(dialog);
    }
}
