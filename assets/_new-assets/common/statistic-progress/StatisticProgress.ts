// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class StatisticProgress extends cc.Component {

    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;

    @property(cc.Label)
    leftValue: cc.Label = null;

    @property(cc.Label)
    rightValue: cc.Label = null;

    @property
    left: string = 'TÀI';

    @property
    right: string = 'XỈU';

    @property
    suffix: string = '%';

    public setProgress(value: number) {
        this.progress.progress = value;
        var roundValue = Math.floor(value * 100);
        var rightValue = 100 - roundValue;
        this.leftValue.string = `${this.left} ${roundValue}${this.suffix}`;
        this.rightValue.string = `${this.right} ${rightValue}${this.suffix}`;

        this.leftValue.node.active = true;
        this.rightValue.node.active = true;
    }

    public clear() {
        this.progress.progress = .5;
        this.leftValue.node.active = false;
        this.rightValue.node.active = false;
    }
}
