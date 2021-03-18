import { numberWithCommas } from '../../../common/helpers/NumberHelper';
import BigSmallBetHistory from '../../bigsmall/view-models/BigSmallBetHistory';
import TurboOddEven from './TurboOddEven';

const { ccclass, property } = cc._decorator;
@ccclass
export default class TurboOddEvenBetHistory extends BigSmallBetHistory {
    init(main: TurboOddEven, roundId: number) {
        this.main = main;
        this.roundId = roundId;
    }

    updateChoicesData(data) {
        const { total, even, odd, settlementResult } = data;

        this.leftBetAmount.string = numberWithCommas(total?.even?.betAmount ?? 0);
        this.leftRefundAmount.string = numberWithCommas(total?.even?.refund ?? 0);
        this.rightBetAmount.string = numberWithCommas(total?.odd?.betAmount ?? 0);
        this.rightRefundAmount.string = numberWithCommas(total?.odd?.refund ?? 0);

        this.leftResultNode.opacity = settlementResult?.even ? 255 : 100;
        this.rightResultNode.opacity = settlementResult?.odd ? 255 : 100;

        if (even.length) {
            even.forEach((user) => {
                const item = this.addItem(user);
                this.leftContent.addChild(item);
            });
        }

        if (odd.length) {
            odd.forEach((user) => {
                const item = this.addItem(user);
                this.rightContent.addChild(item);
            });
        }
    }
}
