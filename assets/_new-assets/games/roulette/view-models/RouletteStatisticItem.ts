// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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

    // update (dt) {}
}
