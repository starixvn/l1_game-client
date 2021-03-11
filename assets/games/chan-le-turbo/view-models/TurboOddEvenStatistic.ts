import BigSmallStatistic from '../../tai-xiu/view-models/BigSmallStatistic';

const { ccclass, property } = cc._decorator;

@ccclass
export default class TurboOddEvenStatistic extends BigSmallStatistic {
    protected readonly betTypes = ["even", "odd"];

    showResultDots() {
        this.calculateResultStatistic();

        this.resultDots.children.forEach((dot, index) => {
            if (index > this.dataLogs.length) {
                return;
            }

            const component = dot.getComponent(cc.Sprite);
            component.spriteFrame = this.dataLogs[index].settlementResult.even ? this.blackDot : this.whiteDot;
        });
    }

    checkPointResult(points: number) {
        return points % 2 ? false : true;
    }
}
