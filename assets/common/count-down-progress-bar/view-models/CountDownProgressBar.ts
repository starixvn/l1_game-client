const { ccclass, property } = cc._decorator;

@ccclass
export default class CountDownProgressBar extends cc.Component {
    @property(cc.Node)
    progressBar: cc.Node = null;

    @property(cc.Sprite)
    indicatorSprite: cc.Sprite = null;

    private fullTimeRound: number;
    private placingBetColor = "#0fdb5e";
    private lockingBetColor = "#ff0000";

    onEnable() {
        this.setVisibilityIndicator(false);
    }

    setFulTimeRound(time: number) {
        this.fullTimeRound = time;
    }

    updateProgress(remainingTime: number) {
        this.setVisibilityIndicator(true);
        const value = remainingTime / this.fullTimeRound;
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

    setVisibilityProgressBar(show: boolean) {
        this.progressBar.active = show;
    }
}
