import { getStringDateByTime } from '../../../common/helpers/DateTimeHelper';
import { numberWithCommas } from '../../../common/helpers/NumberHelper';
import BigSmallBetHistory from '../../tai-xiu/view-models/BigSmallBetHistory';
import TurboOddEven from './TurboOddEven';

const { ccclass, property } = cc._decorator;
@ccclass
export default class TurboOddEvenBetHistory extends BigSmallBetHistory {
    init(main: TurboOddEven, roundId: number) {
        this.main = main;
        this.roundId = roundId;
    }

    onData(data: any) {
        this.resetData();

        const { id, time, total, result, even, odd, settlementResult } = data;
        this.roundIdLabel.string = `${id} - ${getStringDateByTime(time)}`;
        this.nextButton.active = this.main.currentDataLogs[0].roundId > id;

        this.leftBetAmount.string = numberWithCommas(total?.even?.betAmount ?? 0);
        this.leftRefundAmount.string = numberWithCommas(total?.even?.refund ?? 0);
        this.rightBetAmount.string = numberWithCommas(total?.odd?.betAmount ?? 0);
        this.rightRefundAmount.string = numberWithCommas(total?.odd?.refund ?? 0);

        this.leftResultNode.opacity = settlementResult?.even ? 255 : 100;
        this.rightResultNode.opacity = settlementResult?.odd ? 255 : 100;

        this.updateDotsResult(result);

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
