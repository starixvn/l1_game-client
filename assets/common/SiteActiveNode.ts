import { SystemType } from "../ISystem";
import configs = require("../configs/Configs");

const { ccclass, property } = cc._decorator;

export enum SiteType {
    SC1 = 0,
    SC2
}

@ccclass
export default class AutoSiteNode extends cc.Component {
    @property({ type: cc.Enum(SiteType) })
    activeSite = SiteType.SC1;

    offeredSites = [SystemType.SC1, SystemType.SC2];

    onLoad() {
        this.node.active = configs.systemType === this.offeredSites[this.activeSite];
    }
}
