import { numberWithCommas } from "../../../common/helpers/Helper";
import GameGuideBase from "../../_base/view-models/GameGuideBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrabGuide extends GameGuideBase {
    createReplaceData(configs) {
        const { odds, choices_maxbet } = configs;

        return {
            _oddSingle: odds.single,
            _oddDouble: odds.double,
            _oddTriple: odds.triple,
            _oddMountain: odds.mountain,
            _oddOcean: odds.ocean,
            _oddAnyTriple: odds.anyTriple,
            _minBet: numberWithCommas(configs.minbet),
            _maxBetMain: numberWithCommas(choices_maxbet.fish),
            _maxBetAnyTriple: numberWithCommas(choices_maxbet.anyTriple),
            _maxBetRound: numberWithCommas(configs.maxbet)
        };
    }
}
