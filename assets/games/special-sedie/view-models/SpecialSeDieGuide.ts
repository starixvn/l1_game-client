import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import GameGuideBase from "../../_base/view-models/GameGuideBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialSeDieGuide extends GameGuideBase {
    createReplaceData(configs) {
        const odds = configs.odds;
        return {
            _oddsMain: odds.even,
            _maxBetRound: numberWithCommas(configs.maxbet)
        };
    }
}
