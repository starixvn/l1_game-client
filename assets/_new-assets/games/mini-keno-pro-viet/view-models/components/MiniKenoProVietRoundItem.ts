const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoProVietRoundItem extends cc.Component {
    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    roundTime: cc.Label = null;

    @property(cc.Label)
    roundDate: cc.Label = null;
}
