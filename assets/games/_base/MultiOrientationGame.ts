import SocketIOTableGameBase from "./SocketIOTableGameBase";

const { ccclass, property } = cc._decorator;

export enum Orientation {
    Landscape = 1,
    Portrait
}

@ccclass
export default class MultiOrientationGame extends SocketIOTableGameBase {
    @property({ type: cc.Enum(Orientation) })
    orientation = Orientation.Landscape;

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
        betData["m"] = this.orientation;
        return betData;
    }
}
