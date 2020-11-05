import { numberWithCommas } from "../../../common/helpers/Helper";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrabGuide extends cc.Component {

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
            "_oddSingle": odds.single,
            "_oddDouble": odds.double,
            "_oddTriple": odds.triple,
            "_oddAnyTriple": odds.anyTriple,
            "_minBet": numberWithCommas(configs.minbet),
            "_maxBetMain": numberWithCommas(choices_maxbet.fish),
            "_maxBetAnyTriple": numberWithCommas(choices_maxbet.anyTriple),
            "_maxBetRound": numberWithCommas(configs.maxbet)
        };

        return replaceData;
    }
}
