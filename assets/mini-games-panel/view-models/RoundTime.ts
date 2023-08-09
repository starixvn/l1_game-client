import { numberPad } from "../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoundTime extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    resetTime() {
        this.time.string = "";
    }

    setTime(time: number) {
        this.time.string = `${numberPad(time, 2)}`;
    }
}
