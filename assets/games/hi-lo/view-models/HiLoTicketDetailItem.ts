const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTicketDetailItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    turn: cc.Label = null;

    @property(cc.Label)
    betChoice: cc.Label = null;

    @property(cc.Label)
    baseCard: cc.Label = null;

    @property(cc.Label)
    resultCard: cc.Label = null;

    @property(cc.Label)
    stake: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    renderTicketDetailItem(logDetail: any) {}
}
