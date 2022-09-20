const { ccclass, property } = cc._decorator;

@ccclass
export default class CountDownProgressBar extends cc.Component {
    @property(cc.Sprite)
    progressCircleBar: cc.Sprite = null;

    private fullTimeRound: number;
    private placingBetColor = "#0fdb5e";
    private lockingBetColor = "#ff0000";

    onEnable() {
        this.progressCircleBar.node.active = false;
    }

    setFulTimeRound(time: number) {
        this.fullTimeRound = time;
    }

    updateProgress(remainingTime: number) {
        this.setVisibilityProgressBar(true);
        const value = remainingTime / this.fullTimeRound;
        this.progressCircleBar.fillRange = value;
    }

    updateBetFrame() {
        this.progressCircleBar.node.color = cc.Color.BLACK.fromHEX(this.placingBetColor);
    }

    updateLockingBetFrame() {
        this.progressCircleBar.node.color = cc.Color.BLACK.fromHEX(this.lockingBetColor);
    }

    setVisibilityProgressBar(show: boolean) {
        this.progressCircleBar.node.active = show;
    }
}
