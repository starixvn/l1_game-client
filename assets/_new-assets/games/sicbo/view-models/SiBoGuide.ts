import { numberWithCommas } from "../../../common/helpers/Helper";


const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoGuide extends cc.Component {

    @property({ type: cc.Label })
    replaceNodes: cc.Label[] = [];

    init(configs) {
        const replaceData = this.createReplaceData(configs);

        this.replaceNodes.forEach(label => {
            Object.keys(replaceData).forEach(key => {
                label.string = label.string.replace(key, replaceData[key]);
            });
        });
    }

    createReplaceData(configs) {
        const { odds, choices_maxbet } = configs;
        const replaceData = {
            "_oddBig": odds.big,
            "_oddAnyTriple": odds.anyTriple,
            "_oddSingle": odds.single,
            "_oddDouble": odds.double,
            "_oddTriple": odds.triple,
            "_oddTotal4": odds.total4,
            "_oddTotal5": odds.total5,
            "_oddTotal6": odds.total6,
            "_oddTotal7": odds.total7,
            "_oddTotal8": odds.total8,
            "_oddTotal9": odds.total9,
            "_minBet": numberWithCommas(configs.minbet),
            "_maxBetBig": numberWithCommas(choices_maxbet.big),
            "_maxBetAnyTriple": numberWithCommas(choices_maxbet.anyTriple),
            "_maxBetSpecific": numberWithCommas(choices_maxbet.specific1),
            "_maxBetTotal4": numberWithCommas(choices_maxbet.total4),
            "_maxBetTotal8": numberWithCommas(choices_maxbet.total8),
            "_maxBetRound": numberWithCommas(configs.maxbet)
        };

        return replaceData;
    }
}
