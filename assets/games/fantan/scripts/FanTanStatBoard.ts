import { lodash } from "../../../ClientModules";
import GameUtils from "../../../common/GameUtils";
import StatisticBoard from "../../../common/statistic-board/StatisticBoard";
import BeadRoad from "../../_base/view-models/BeadRoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FanTanStatBoard extends StatisticBoard {
    @property(BeadRoad)
    beadRoad: BeadRoad = null;

    @property
    isBeadRoad = false;

    percentChoices = ["odd", "even"];

    onChangedSupportChoices() {
        this.originalChoices = this.supportChoices.split(",");
        this.itemPercentList.forEach((item, index) => {
            const iconFrame = this.atlas.getSpriteFrame(`dot_${this.percentChoices[index]}`);
            item.init(iconFrame, GameUtils.getBetChoiceString(this.percentChoices[index]));
        });
    }

    updateRoundHistory = (roundHistory) => {
        this.hideNextItem();
        if (roundHistory.length > 0) {
            const originalChoices = this.originalChoices;
            let percentage = {};

            if (this.isBeadRoad) {
                percentage = GameUtils.calculateWin(this.percentChoices, roundHistory);
                this.itemPercentList.forEach((item, index) => {
                    item.setPercent(percentage[this.percentChoices[index]]);
                });
            } else {
                const originalChoices = this.originalChoices;
                percentage = GameUtils.calculateWin(originalChoices, roundHistory);
                this.itemPercentList.forEach((item, index) => {
                    item.setPercent(percentage[this.originalChoices[index]]);
                });
            }

            const data = roundHistory.map((history) => {
                const result = {};
                const winChoice = this.originalChoices.find((choice) => history.settlementResult[choice]);
                result["type"] = originalChoices.findIndex((choice) => choice === winChoice);
                result["choice"] = winChoice;
                result["extra"] = this.generateExtra(history.result);
                return result;
            });
            this.beadRoad && this.beadRoad.setData(data);
            const reverseData = lodash.cloneDeep(data).reverse();
            this.logControl && this.logControl.setExtendedData(reverseData);
        }
    };
}
