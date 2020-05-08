const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoUserHistoryItem extends cc.Component {

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property(cc.Label)
    total: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;
}
