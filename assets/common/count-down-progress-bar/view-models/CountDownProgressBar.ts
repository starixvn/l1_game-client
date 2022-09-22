const { ccclass, property } = cc._decorator;

@ccclass
export default class CountDownProgressBar extends cc.Component {
    @property(cc.Node)
    progressBar: cc.Node = null;

    @property(cc.Sprite)
    indicatorSprite: cc.Sprite = null;

    private fullRoundTime: number;
    public isShowRevertCountDown = false;
    private placingBetColor = "#0fdb5e";
    private lockingBetColor = "#ff0000";

    onEnable() {
        this.setVisibilityIndicator(false);
    }

    setFulTimeRound(time: number) {
        this.fullRoundTime = time;
    }

    updateProgress(remainingTime: number) {
        this.setVisibilityIndicator(true);
        const value = remainingTime / this.fullRoundTime;
        this.indicatorSprite.fillRange = value;
    }

    updateBetFrame() {
        this.indicatorSprite.node.color = cc.Color.BLACK.fromHEX(this.placingBetColor);
    }

    updateLockingBetFrame() {
        this.indicatorSprite.node.color = cc.Color.BLACK.fromHEX(this.lockingBetColor);
    }

    setVisibilityIndicator(show: boolean) {
        this.indicatorSprite.node.active = show;
    }

    revertCountDown(duration: number) {
        this.updateBetFrame();
        this.setVisibilityIndicator(true);

        this.isShowRevertCountDown = true;
        cc.tween(this.indicatorSprite)
            .to(duration, { fillRange: 1 }, { easing: "sineIn" })
            .delay(duration)
            .call(() => (this.isShowRevertCountDown = false))
            .start();
    }
}
