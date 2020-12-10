import { numberWithCommas } from "../../../common/helpers/Helper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipSedieWarGuide extends cc.Component {
    @property({ type: cc.Label })
    replaceNodes: cc.Label[] = [];

    protected configs: any;

    init(configs) {
        this.configs = configs;
        const replaceData = this.createReplaceData();

        this.replaceNodes.forEach(label => {
            Object.keys(replaceData).forEach(key => {
                label.string = label.string.replace(key, replaceData[key]);
            });
        });
    }

    createReplaceData() {
        const odds = this.configs.odds;
        const choiceMaxBet = this.configs.choices_maxbet;
        const replaceData = {
            "_oddsPlayerEven": odds.playerEven,
            "_oddsPlayerRed3": odds.playerRed3,
            "_oddsPlayerRed4": odds.playerRed4,
            "_oddsBankerEven": odds.bankerEven,
            "_oddsBankerRed3": odds.bankerRed3,
            "_oddsBankerRed4": odds.bankerRed4,
            "_oddsPlayer": odds.player,
            "_oddsTie": odds.tie,
            "_oddsEven": odds.even,
            "_minBet": numberWithCommas(this.configs.minbet),
            "_maxBetRound": numberWithCommas(this.configs.maxbet),
            "_maxBetPlayerRed4": numberWithCommas(choiceMaxBet.playerRed4),
            "_maxBetBankerRed4": numberWithCommas(choiceMaxBet.bankerRed4),
            "_maxBetPlayer": numberWithCommas(choiceMaxBet.player),
            "_maxBetBanker": numberWithCommas(choiceMaxBet.banker)
        }

        return replaceData;
    }
}