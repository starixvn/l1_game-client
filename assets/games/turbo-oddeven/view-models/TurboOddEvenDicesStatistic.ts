import { TurboOddEvenBetType } from "./type";
import BigSmallDicesStatistic from "../../bigsmall/view-models/BigSmallDicesStatistic";

const { ccclass } = cc._decorator;

@ccclass
export default class TurboOddEvenDicesStatistic extends BigSmallDicesStatistic {
    updatePercentages(dataLogs: any[]) {
        if (dataLogs.length > 0) {
            let oddTotal = 0,
                evenTotal = 0;

            dataLogs.forEach((log) => {
                const { settlementResult } = log;

                oddTotal += settlementResult[TurboOddEvenBetType.odd] ? 1 : 0;
                evenTotal += settlementResult[TurboOddEvenBetType.even] ? 1 : 0;
            });

            const length = dataLogs.length;
            const oddPercentage = Math.round((oddTotal / length) * 100);
            const evenPercentage = Math.round((evenTotal / length) * 100);

            this.PercentageBig.string = `${oddPercentage}%`;
            this.PercentageSmall.string = `${evenPercentage}%`;
        }
    }

    renderLogView(dataLogs: any[]) {
        const statsData = [];
        if (dataLogs.length > 0) {
            dataLogs.forEach((log) => {
                const { settlementResult } = log;
                statsData.unshift(settlementResult.even ? 0 : 1);
            });
            this.logView.setData(statsData);
        }
    }
}
