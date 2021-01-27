import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import GameGuideBase from "../../_base/view-models/GameGuideBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoGuide extends GameGuideBase {
    createReplaceData(configs) {
        const { odds, choices_maxbet } = configs;
        return {
            _oddBig: odds.big,
            _oddAnyTriple: odds.anyTriple,
            _oddSingle: odds.single,
            _oddDouble: odds.double,
            _oddTriple: odds.triple,
            _oddTotal4: odds.total4,
            _oddTotal5: odds.total5,
            _oddTotal6: odds.total6,
            _oddTotal7: odds.total7,
            _oddTotal8: odds.total8,
            _oddTotal9: odds.total9,
            _minBet: numberWithCommas(configs.minbet),
            _maxBetBig: numberWithCommas(choices_maxbet.big),
            _maxBetAnyTriple: numberWithCommas(choices_maxbet.anyTriple),
            _maxBetSpecific: numberWithCommas(choices_maxbet.specific1),
            _maxBetTotal4: numberWithCommas(choices_maxbet.total4),
            _maxBetTotal8: numberWithCommas(choices_maxbet.total8),
            _maxBetRound: numberWithCommas(configs.maxbet)
        };
    }
}
