
const { ccclass, property } = cc._decorator;

@ccclass
export default class LeftControls extends cc.Component {
    @property(cc.Node)
    homeButton: cc.Node = null;

    @property(cc.Node)
    guideButton: cc.Node = null;

    @property(cc.Node)
    historyButton: cc.Node = null;

    @property(cc.Node)
    statisticButton: cc.Node = null;
}
