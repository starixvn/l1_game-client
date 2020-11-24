const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoStatisticColumn extends cc.Component {
    @property(cc.Sprite)
    dots: cc.Sprite[] = [];
}