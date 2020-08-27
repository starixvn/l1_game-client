import { numberWithCommas } from "../../../common/helpers/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieGuide extends cc.Component {
    @property({ type: cc.Label })
    replaceNodes: cc.Label[] = [];

    private configs: any;

    init(configs) {
        this.configs = configs;

        const odds = this.configs.odds;
        const choiceMaxBet = this.configs.choices_maxbet;
        const replaceData = {
            "_oddsMain": odds.even,
            "_oddsRed4": odds.red4,
            "_oddsRed3": odds.red3,
            "_minBet": numberWithCommas(this.configs.minbet),
            "_maxBetMain": numberWithCommas(choiceMaxBet.even),
            "_maxBetRed4": numberWithCommas(choiceMaxBet.red4),
            "_maxBetRed3": numberWithCommas(choiceMaxBet.red3),
            "_maxBetRound": numberWithCommas(this.configs.maxbet)
        }

        this.replaceNodes.forEach(label => {
            Object.keys(replaceData).forEach(key => {
                label.string = label.string.replace(key, replaceData[key]);
            });
        });
    }
}