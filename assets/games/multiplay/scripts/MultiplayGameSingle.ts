import CountDownProgressBar from "../../../common/count-down-progress-bar/view-models/CountDownProgressBar";
import MiniGameBase from "../../_base_new/view-models/MiniGameBase";
import MultiplayGameHistory from "./MultiplayGameHistory";

const { ccclass } = cc._decorator;

export const KeyStorageStatisticOpen = "MultiStatisticStatus";

@ccclass
export default abstract class MultiplayGameSingle extends MiniGameBase {
    protected override managedByContainer = true;
    public isMiniGameInContainer = true;
    public isBetSound = false;
    protected showStatistic = true;
    protected statisticHistory: cc.Component = null;
    protected mainGameId: number;

    onEnable() {
        super.onEnable();
        this.initStatusStatistic();
    }

    onDisconnected() {
        super.onDisconnected();
        this.onDisconnectCallback && this.onDisconnectCallback();
    }

    public openHistory() {
        const dialog = cc.instantiate(this.historyPrefab);
        this.currentMiniPanel.addDialog(dialog);
        const control = dialog.getComponent(MultiplayGameHistory);
        control.initDefaultGame(this.gameId);
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

    private initStatusStatistic() {
        const status = this.getStorageStatusStatistic();
        this.handleShowStatistic(status);
        this.showStatistic = status;
    }

    private openStatistic() {
        this.showStatistic = !this.showStatistic;
        this.handleShowStatistic(this.showStatistic);
        this.storageStatusStatistic(this.showStatistic);
    }

    private handleShowStatistic(show: boolean) {
        this.statisticHistory && (this.statisticHistory.node.active = show);
    }

    private storageStatusStatistic(status: boolean) {
        cc.sys.localStorage.setItem(`${KeyStorageStatisticOpen}_${this.mainGameId}`, status);
    }

    private getStorageStatusStatistic(): boolean {
        return cc.sys.localStorage.getItem(`${KeyStorageStatisticOpen}_${this.mainGameId}`) === "false" ? false : true;
    }
}
