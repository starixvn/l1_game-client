const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoTimerNumbers extends cc.Component {

    @property(cc.Label)
    firstNumber: cc.Label = null;

    @property(cc.Label)
    secondNumber: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}
}
