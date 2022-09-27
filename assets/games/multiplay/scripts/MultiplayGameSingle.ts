import MiniGameBase from "../../_base_new/view-models/MiniGameBase";
import MultiplayGameHistory from "./MultiplayGameHistory";
import CountDownProgressBar from "../../../common/count-down-progress-bar/view-models/CountDownProgressBar";

const { ccclass } = cc._decorator;

export const KeyStorageStatisticOpen = "MultiStatisticStatus";

@ccclass
export default class MultiplayGameSingle extends MiniGameBase {
    protected override managedByContainer = true;
    public isMiniGameInContainer = true;
    public isBetSound = false;

    public onDisconnectCallback = () => {
        // callback
    };

    maximizeCallback = (gameId: number) => {
        //callback
    };

    onClickMaximize() {
        this.maximizeCallback(this.gameId);
    }

    onDisconnected() {
        super.onDisconnected();
        this.onDisconnectCallback && this.onDisconnectCallback();
    }

    public openHistory() {
        const dialog = cc.instantiate(this.historyPrefab);
        this.currentMiniPanel.addDialog(dialog);
        const control = dialog.getComponent(MultiplayGameHistory);
        control.handleSocketFromGame(this.gameId);
    }

    initCountDownProgressBar(node: cc.Node) {
        const countDownTimer = node.getComponent(CountDownProgressBar);
        if (countDownTimer) {
            this.countDownProgressBar = countDownTimer;
            countDownTimer.setFullRoundTime(this.config.betTime);
            this.animatedTime.setNumberColor("#0fdb5e", "#ff0000");
        }
    }

    updateDisplayForRemoteConfig() {
        this.updateOddsFromConfigs();
        // without set value bet chip
    }

    storageStatusStatistic(status: boolean, gameId: number) {
        cc.sys.localStorage.setItem(`${KeyStorageStatisticOpen}_${gameId}`, status);
    }

    getStorageStatusStatistic(gameId: number): boolean {
        return cc.sys.localStorage.getItem(`${KeyStorageStatisticOpen}_${gameId}`) === "false" ? false : true;
    }
}
