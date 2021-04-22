import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import GameGuideBase from "../../_base/view-models/GameGuideBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ThreeCardsGuide extends GameGuideBase {
    createReplaceData(configs) {
        const { odds, choices_maxbet, minbet, maxbet } = configs;
        const bet = 10;
        return {
            _oddsRed: odds.red,
            _oddsBlack: odds.black,
            _oddsDiamonds: odds.diamonds,
            _oddsHearts: odds.hearts,
            _oddsClubs: odds.clubs,
            _oddsSpades: odds.spades,

            _bet: bet,
            _winRed: numberWithCommas(bet * odds.red),
            _winDiamonds: numberWithCommas(bet * odds.diamonds),

            _maxBetRed: numberWithCommas(choices_maxbet.red),
            _maxBetDiamonds: numberWithCommas(choices_maxbet.diamonds),
            _minBet: numberWithCommas(minbet),
            _maxBetRound: numberWithCommas(maxbet)
        };
    }
}
