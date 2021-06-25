import { games } from "../../../configs/SabaConfigs";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import BigSmall from "../../bigsmall/view-models/BigSmall";
import TurboBigSmallTimeHandler from "../../turbo-bigsmall/view-models/handlers/TurboBigSmallTimeHandler";
import { TurboBigSmallConfigs } from "../../turbo-bigsmall/view-models/TurboBigSmallConfigs";
import TurboOddEvenStatistic from "./TurboOddEvenStatistic";

const { ccclass } = cc._decorator;

@ccclass
export default class TurboOddEven extends BigSmall {
    readonly choices = ["odd", "even"];

    get gameId() {
        return games.TurboOddEven.id;
    }

    initHandlers() {
        super.initHandlers();
        this.timeHandler = new TurboBigSmallTimeHandler(this);
    }

    initMiniPanel(miniPanel: MiniPanel) {
        this.init("OETurbo", new TurboBigSmallConfigs(), miniPanel);
    }
}
