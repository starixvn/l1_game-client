const { ccclass, property } = cc._decorator;

@ccclass
export default class BaccaratHistoryItem extends cc.Component {

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property([cc.Node])
    playerResult: Array<cc.Node> = [];

    @property([cc.Node])
    bankerResult: Array<cc.Node> = [];

    @property(cc.Label)
    player: cc.Label = null;

    @property(cc.Label)
    banker: cc.Label = null;

    @property(cc.Label)
    tie: cc.Label = null;

    @property(cc.Label)
    playerPair: cc.Label = null;

    @property(cc.Label)
    bankerPair: cc.Label = null;

    @property(cc.Label)
    big: cc.Label = null;

    @property(cc.Label)
    small: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;
}
