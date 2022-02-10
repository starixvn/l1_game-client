import { HiLoState } from "../events-models/HiLoState";
import HiLoStatistic from "./HiLoStatistic";
const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTopArea extends cc.Component {
    @property(cc.Node)
    guideNode: cc.Node = null;

    @property(cc.Node)
    statisticContainer: cc.Node = null;

    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    statisticComp: HiLoStatistic;

    onLoad() {
        this.showGuideInfo(true);
        this.initStatistic();
    }

    showGuideInfo(status: boolean) {
        this.guideNode.active = status;
        this.statisticContainer.active = !status;
    }

    initStatistic() {
        const node = cc.instantiate(this.statisticPrefab);
        this.statisticComp = node.getComponent(HiLoStatistic);
        this.statisticContainer.addChild(node);
    }
}
