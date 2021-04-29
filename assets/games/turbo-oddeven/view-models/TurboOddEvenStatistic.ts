import BigSmallStatistic from '../../bigsmall/view-models/BigSmallStatistic';

const { ccclass, property } = cc._decorator;

@ccclass
export default class TurboOddEvenStatistic extends BigSmallStatistic {
    protected readonly betTypes = ["even", "odd"];

    checkPointResult(points: number) {
        return points % 2 ? false : true;
    }
}
