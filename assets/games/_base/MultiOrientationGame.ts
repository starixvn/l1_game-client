import { Orientation } from "./Orientation";
import SocketIOTableGameBase from "./SocketIOTableGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiOrientationGame extends SocketIOTableGameBase {
    @property({ type: cc.Enum(Orientation) })
    orientation = Orientation.Landscape;

    public onCurrentBetChange = (bet: number) => {};
    public changeOrirentationCallback = () => {};
    public getCurrentBet = () => {
        return 0;
    };

    override start() {}

    onDestroy() {
        this.clearIntervalAndTimeout();
    }

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

    public updateDisplayForRemoteConfig() {
        super.updateDisplayForRemoteConfig();
        if (this.node.activeInHierarchy) {
            this.betChips.setSelectedIndexAndScroll(this.getCurrentBet().toString());
        }
    }
}
