import BigSmallMiniRoundHistoryItem from '../../tai-xiu/view-models/BigSmallMiniRoundHistoryItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class TurboOddEvenMiniRoundHistoryItem extends BigSmallMiniRoundHistoryItem {
    public setData(data: any) {
        this.data = data;

        const points = data.result.dice1 + data.result.dice2 + data.result.dice3;
        this.icon.spriteFrame = points % 2 ? this.whiteDot : this.blackDot;
    }
}
