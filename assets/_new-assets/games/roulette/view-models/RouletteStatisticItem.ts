const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteStatisticItem extends cc.Component {

    @property(cc.Label)
    firstValue: cc.Label = null;

    @property(cc.Label)
    secondValue: cc.Label = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    public updateProgressBar(firstCount, secondCount) {
        let progress = firstCount / (firstCount + secondCount);
        progress = Math.min(progress, 1);
        this.progressBar.progress = progress < 0 ? 1 : progress;
    }
}
