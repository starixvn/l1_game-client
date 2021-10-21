import BitcoinMaster from "./BitcoinMaster";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitCoinMasterProgressBar extends cc.Component {
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    mainGame: BitcoinMaster = null;
    passedTime: number = 0;

    init(main: BitcoinMaster) {
        this.mainGame = main;
        this.passedTime = this.mainGame.config.fullTime - this.mainGame.remainingTimeGame;
        this.schedule(this.setData, 1);
    }

    setData() {
        this.passedTime++;
        let progress = this.passedTime / this.mainGame.config.fullTime;
        progress = Math.min(progress, 1);
        this.progressBar.progress = progress < 0 ? 1 : progress;

        if (this.passedTime <= 0) {
            this.unschedule(this.setData);
        }
    }
}
