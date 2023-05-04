import GameUtils from "../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotPoolBelongToStake extends cc.Component {
    @property(cc.Label)
    jackpotPoolLabel: cc.Label = null;

    updatePool(value: number) {
        GameUtils.floatToNumber({ label: this.jackpotPoolLabel, amount: value, duration: 0.6, noZeroSuffix: false });
    }
}
