const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoStatusBanner extends cc.Component {

    @property(cc.Label)
    gameName: cc.Label = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    winAmount: cc.Label = null;
}
