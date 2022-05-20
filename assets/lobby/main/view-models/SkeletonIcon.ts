const { ccclass, property } = cc._decorator;

@ccclass
export default class SkeletonIcon extends cc.Component {
    @property(cc.Label)
    gameName: cc.Label = null;
}
