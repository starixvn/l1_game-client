import { Orientation } from "./Orientation";
import SocketIOTableGameBase from "./SocketIOTableGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiOrientationGame extends SocketIOTableGameBase {
    @property({ type: cc.Enum(Orientation) })
    orientation = Orientation.Landscape;

    onCurrentBetChange = (bet: number) => {};

    start() {}

    onDestroy() {
        this.clearIntervalAndTimeout();
    }

    changeOrirentationCallback = () => {};

    onClickChangeOrientation() {
        this.changeOrirentationCallback();
    }

    createCommonBetData() {
        const betData = super.createCommonBetData();
        betData["m"] = this.orientation.toString();
        return betData;
    }

    protected onChangedBetChip(bet) {
        super.onChangedBetChip(bet);
        this.onCurrentBetChange(bet);
    }
}
