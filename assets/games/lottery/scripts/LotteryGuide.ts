import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import GameGuideBase from "../../_base/view-models/GameGuideBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryGuide extends GameGuideBase {
    createReplaceData(configs) {
        const { odds, choices_maxbet, minbet, maxbet } = configs;
        const betValue = 10;
        return {
            _odds4Sets: odds["4Sets"],
            _examValue: betValue,
            _examResult4Sets: betValue * odds["4Sets"] * 2,

            _oddsSpecial: odds.special,
            _examResultSpecial: odds.special * betValue,

            _oddsHead: odds.head,
            _examResultHead: odds.head * betValue,

            _oddsTail: odds.tail,
            _odds27Sets: odds["27Sets"],
            _examResult27Sets2: betValue * odds["27Sets"] * 2,
            _examResult27Sets: betValue * odds["27Sets"],

            _oddsParlay2: odds.parlay2,
            _oddsParlay3: odds.parlay3,
            _oddsParlay4: odds.parlay4,
            _oddsOthers: odds.others,
            _maxBet4Sets: numberWithCommas(choices_maxbet["4Sets"]),
            _maxBetSpecial: numberWithCommas(choices_maxbet.special),
            _maxBetHead: numberWithCommas(choices_maxbet.head),
            _maxBetTail: numberWithCommas(choices_maxbet.tail),
            _maxBet27Sets: numberWithCommas(choices_maxbet["27Sets"]),
            _maxBetParlay2: numberWithCommas(choices_maxbet.parlay2),
            _maxBetParlay3: numberWithCommas(choices_maxbet.parlay3),
            _maxBetParlay4: numberWithCommas(choices_maxbet.parlay4),
            _maxBetOthers: numberWithCommas(choices_maxbet.others),
            _minBet: numberWithCommas(minbet),
            _maxBet: numberWithCommas(maxbet)
        };
    }
}
