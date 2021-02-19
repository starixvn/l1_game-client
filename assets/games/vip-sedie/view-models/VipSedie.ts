import { games } from "../../../configs/SabaConfigs";
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

    setDots(result) {
        const randomOption = this.randomPosNode.children[this.roundId % 5];

        Object.keys(result).forEach((key, index) => {
            this.dots[index].node.position = randomOption.children[index].position;
            this.dots[index].spriteFrame = result[key] ? this.dotRed : this.dotWhite;
        });
    }
}
