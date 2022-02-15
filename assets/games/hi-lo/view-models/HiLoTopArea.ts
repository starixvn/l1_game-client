import HiLoStatistic from "./HiLoStatistic";
import LightEffect from "./LightEffect";
const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTopArea extends cc.Component {
    @property(cc.Node)
    guideNode: cc.Node = null;

    @property(cc.Node)
    statisticContainer: cc.Node = null;

    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    @property(LightEffect)
    lightEffect: LightEffect = null;

    statisticComp: HiLoStatistic;

    onLoad() {
        this.initStatistic();
        this.showGuideInfo(true);
    }

    showGuideInfo(status: boolean) {
        this.guideNode.active = status;
        this.statisticContainer.active = !status;
        if (status) {
            this.lightEffect.playAnimation();
            this.statisticComp.statisticContainer && this.statisticComp.clearCards();
        }
    }

    initStatistic() {
        const node = cc.instantiate(this.statisticPrefab);
        this.statisticComp = node.getComponent(HiLoStatistic);
        this.statisticContainer.addChild(node);
    }
}
