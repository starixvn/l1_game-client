const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoHistoryDetailItem extends cc.Component {

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;
}