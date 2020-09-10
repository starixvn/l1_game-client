import Sedie from "../../xoc-xoc/view-models/Sedie";
import { SedieConfigs } from "../../xoc-xoc/view-models/SedieConfigs";
import { gameIds } from "../../../Configs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipSedie extends Sedie {

    protected internalInit() {
        this.init("vipsedie", new SedieConfigs(), null, 1, gameIds.VipSedie);
        this.finishShowResult = false;
    }
}
