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
        const reverseData = lodash.cloneDeep(data).reverse();
        console.log(reverseData);
        this.beadRoad && this.beadRoad.setData(reverseData);
    }

    enableNextItem(show: boolean) {
        super.enableNextItem(show);
        this.beadRoad && (this.beadRoad.showNext = show);
    }
}
