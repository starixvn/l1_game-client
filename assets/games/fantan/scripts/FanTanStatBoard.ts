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

    setSupportChoices(choices: string) {
        super.setSupportChoices(choices);
        if (this.isBeadRoad) {
            this.onChangedSupportChoices(this.percentChoices);
        }
    }

    calculateWin(originalChoices: string[], roundHistory: any) {
        let percentage = {};
        let percentBetChoices: string[];
        if (this.isBeadRoad) {
            percentBetChoices = this.percentChoices;
            percentage = GameUtils.calculateWin(this.percentChoices, roundHistory);
        } else {
            percentBetChoices = this.originalChoices;
            percentage = GameUtils.calculateWin(originalChoices, roundHistory);
        }
        this.itemPercentList.forEach((item, index) => {
            item.setPercent(percentage[percentBetChoices[index]]);
        });
    }

    updateBeadRoad(data: any) {
        this.beadRoad && this.beadRoad.setData(data);
    }
}
