import SocketIOTableGameBase from "./SocketIOTableGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiOrientationGame extends SocketIOTableGameBase {
    start() {}

    onDestroy() {
        this.clearIntervalAndTimeout();
    }

    changeOrirentationCallback = () => {};

    onClickChangeOrientation() {
        this.changeOrirentationCallback();
    }
}
