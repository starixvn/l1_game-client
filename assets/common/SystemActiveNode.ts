import { SystemType } from "../ISystem";
import configs = require("../configs/Configs");

const { ccclass, property } = cc._decorator;

export enum SiteType {
    SC1 = 0,
    SC2
}

@ccclass
export default class SystemActiveNode extends cc.Component {
    @property({ type: cc.Enum(SiteType) })
    site = SiteType.SC1;

    siteList = [SystemType.SC1, SystemType.SC2];

    onLoad() {
        this.node.active = configs.systemType === this.siteList[this.site];
    }
}
