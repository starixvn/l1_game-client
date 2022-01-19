import NewMiniGameBase from "../../_new/_base/NewMiniGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLo extends NewMiniGameBase {
    @property(cc.Node)
    betBoardContainer: cc.Node = null;

    @property(cc.Prefab)
    betBoardPrefab: cc.Prefab = null;

    @property(cc.Node)
    topNode: cc.Node = null;

    @property(cc.Node)
    guideNode: cc.Node = null;

    @property(cc.Node)
    statisticContainer: cc.Node = null;

    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    @property(cc.Animation)
    resultAnimation: cc.Animation = null;

    @property(cc.Node)
    cardContainer: cc.Node = null;

    @property(cc.Button)
    playButton: cc.Button = null;

    onLoad() {
        super.onLoad();
        this.showHideTopArea();
    }

    openHistory() {
        this.playClick();
    }

    showHideTopArea() {
        this.topNode.active = !this.topNode.active;
    }

    initBetBoard() {}
}
