import BitcoinMaster from "./BitcoinMaster";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitCoinMasterProgressBar extends cc.Component {
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Node)
    leftLine: cc.Node = null;

    @property(cc.Node)
    rightLine: cc.Node = null;

    mainGame: BitcoinMaster = null;
    passedTime: number = 0;
    betWaitTimeTotal = 105;

    onLoad() {
        this.setLinePosition();
    }

    init(main: BitcoinMaster) {
        this.mainGame = main;

        let offTime = 0;
        if (this.mainGame.currentTimeRemaining > this.betWaitTimeTotal) {
            offTime = this.mainGame.config.fullTime - this.mainGame.currentTimeRemaining;
            this.passedTime = this.betWaitTimeTotal + offTime;
        } else {
            offTime = this.betWaitTimeTotal - this.mainGame.currentTimeRemaining;
            this.passedTime = offTime;
        }

        this.schedule(this.setData, 1);
    }

    setLinePosition() {
        const leftWidget = this.leftLine.getComponent(cc.Widget);
        leftWidget.left = (45 * this.progressBar.totalLength) / 120 - this.leftLine.width;
        const rightWidget = this.rightLine.getComponent(cc.Widget);
        rightWidget.right = (15 * this.progressBar.totalLength) / 120 - this.rightLine.width;
    }

    setData() {
        this.passedTime++;
        let progress = this.passedTime / this.mainGame.config.fullTime;
        progress = Math.min(progress, 1);
        this.progressBar.progress = progress < 0 ? 1 : progress;

        if (this.passedTime === 120) {
            // this.unschedule(this.setData);
            this.passedTime = 0;
        }
    }
}
