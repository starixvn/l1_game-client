const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHoHistoryItem extends cc.Component {

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property([cc.Node])
    result: Array<cc.Node> = [];

    @property(cc.Label)
    betDragon: cc.Label = null;

    @property(cc.Label)
    betTiger: cc.Label = null;

    @property(cc.Label)
    betDraw: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;
}
