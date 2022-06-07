import { GameIds } from "../../../configs/SabaConfigs";
import MultiOrientationControl from "../../_base/MultiOrientationControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OrientationSedie extends MultiOrientationControl {
    onLoad() {
        this.gameId = GameIds.SeDie;
        super.onLoad();
    }
}
