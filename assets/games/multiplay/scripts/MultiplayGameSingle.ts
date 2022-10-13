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
    protected groupDefaultGameId: number;

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

    private initStatusStatistic() {
        const status = this.getStorageStatusStatistic();
        this.handleShowStatistic(status);
        this.showStatistic = status;
    }

    private openStatistic() {
        this.showStatistic = !this.showStatistic;
        this.handleShowStatistic(this.showStatistic);
        this.gameData.changeStatusShowStatistic(this.showStatistic);
    }

    private handleShowStatistic(show: boolean) {
        this.statisticHistory && (this.statisticHistory.node.active = show);
    }

    private getStorageStatusStatistic(): boolean {
        return cc.sys.localStorage.getItem(`${KeyStorageStatisticOpen}_${this.groupDefaultGameId}`) === "false" ? false : true;
    }
}
