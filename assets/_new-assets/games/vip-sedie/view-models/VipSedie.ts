import * as _ from "lodash";

import { games } from "../../../SabaConfigs";
import Sedie from "../../xoc-xoc/view-models/Sedie";
import { SedieConfigs } from "../../xoc-xoc/view-models/SedieConfigs";
import VipSedieLogHandler from "./handlers/VipSedieLogHandler";
import VipSedieTimeHandler from "./handlers/VipSedieTimeHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipSedie extends Sedie {

    @property(cc.Node)
    randomPosNode: cc.Node = null;

    initHandlers() {
        super.initHandlers();
        this.timeHandler = new VipSedieTimeHandler(this);
        this.logsHandler = new VipSedieLogHandler(this);
    }

    protected internalInit() {
        this.init("VipSeDie", new SedieConfigs(), null, 1, games.VipSedie.id);
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

    setDots(result) {
        const optRandom = _.random(0, this.randomPosNode.children.length - 1);
        const randomOption = this.randomPosNode.children[optRandom];
        Object.keys(result).forEach((key, index) => {
            this.dots[index].node.position = randomOption.children[index].position;
            this.dots[index].spriteFrame = result[key] ? this.dotRed : this.dotWhite;
        });
    }
}
