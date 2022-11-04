import StandAloneTableGameBase from "../../_base_new/view-models/StandAloneTableGameBase";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import { FantanConfig, FantanId } from "./FantanConfig";
import FantanBowlAnimation from "./FantanBowlAnimation";

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
}
