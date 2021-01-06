import GameGuideBase from "../../_base/view-models/GameGuideBase";
import { numberWithCommas } from "./../../../common/helpers/Helper";

const { ccclass, property } = cc._decorator;
@ccclass
export default class BlackJackGuide extends GameGuideBase {
    createReplaceData(configs) {
        const odds = configs.odds;

        return {
            _oddsRegular: odds.regular,
            _oddsBlackjack: odds.blackjack,
            _minBet: numberWithCommas(configs.minbet),
            _maxBet: numberWithCommas(configs.maxbet)
        };
    }
}
