const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHoHistoryItem extends cc.Component {

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property([cc.Sprite])
    result: Array<cc.Sprite> = [];

    @property([cc.Label])
    bet: Array<cc.Label> = [];

    @property(cc.Label)
    win: cc.Label = null;
}
