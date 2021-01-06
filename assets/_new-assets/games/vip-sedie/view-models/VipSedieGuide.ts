import { numberWithCommas } from "../../../common/helpers/Helper";
import SedieGuide from "../../xoc-xoc/view-models/SedieGuide";

const { ccclass } = cc._decorator;

@ccclass
export default class VipSedieGuide extends SedieGuide {
    createReplaceData(configs) {
        const replaceData = super.createReplaceData(configs);

        const { odds, choices_maxbet } = configs;

        replaceData["_oddsRed2"] = odds.red2;
        replaceData["_maxBetRed2"] = numberWithCommas(choices_maxbet.red2);

        return replaceData;
    }
}
