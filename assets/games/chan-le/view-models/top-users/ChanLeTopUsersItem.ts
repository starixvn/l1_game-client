const { ccclass, property } = cc._decorator;

@ccclass
export default class ChanLeTopUsersItem extends cc.Component {
    @property(cc.Label)
    rank: cc.Label = null;

    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    winMoney: cc.Label = null;
}
