import Sedie from "../../xoc-xoc/view-models/Sedie";
import { SedieConfigs } from "../../xoc-xoc/view-models/SedieConfigs";
import { gameIds } from "../../../Configs";
import VipSedieTimeHandler from "./handlers/VipSedieTimeHandler";
import VipSedieLogHandler from "./handlers/VipSedieLogHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipSedie extends Sedie {

    initHandlers() {
        super.initHandlers();
        this.timeHandler = new VipSedieTimeHandler(this);
        this.logsHandler = new VipSedieLogHandler(this);
    }

    protected internalInit() {
        this.init("VipSeDie", new SedieConfigs(), null, 1, gameIds.VipSedie);
        this.finishShowResult = false;
    }

    public highlightLastResult() {
        if (this.currentTimeRemaining <= this.config.stopBetTime) {
            return;
        }
        const dataLog = this.currentDataLogs[0];
        this.highlightWonItems(dataLog.settlementResult, false);
    }

    private highlightWonItems(settlementResult: any, isAnimated = true) {
        this.betItems.forEach((betItem) => {
            betItem.setHighlight(settlementResult[betItem.node.name], isAnimated);
        });
    }
}
