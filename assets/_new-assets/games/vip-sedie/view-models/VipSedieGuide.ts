import SedieGuide from "../../xoc-xoc/view-models/SedieGuide";
import { numberWithCommas } from "../../../common/helpers/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipSedieGuide extends SedieGuide {

    createReplaceData() {
        const replaceData = super.createReplaceData();

        const odds = this.configs.odds;
        const choiceMaxBet = this.configs.choices_maxbet;

        replaceData["_oddsRed2"] = odds.red2;
        replaceData["_maxBetRed2"] = numberWithCommas(choiceMaxBet.red2);

        return replaceData;
    }
}