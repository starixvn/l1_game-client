import { GameIds } from "../../../configs/SabaConfigs";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import BigSmall from "../../bigsmall/view-models/BigSmall";
import TurboBigSmallTimeHandler from "./handlers/TurboBigSmallTimeHandler";
import { TurboBigSmallConfigs } from "./TurboBigSmallConfigs";

const { ccclass } = cc._decorator;

@ccclass
export default class TurboBigSmall extends BigSmall {
    initMiniPanel(miniPanel: MiniPanel) {
        super.initMiniPanel(miniPanel);
        this.gameId = GameIds.TurboBigSmall;
        this.setConfig(new TurboBigSmallConfigs());
    }

    initHandlers() {
        super.initHandlers();
        this.timeHandler = new TurboBigSmallTimeHandler(this);
    }
}
