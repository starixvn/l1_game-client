const { ccclass, property } = cc._decorator;

import { numberWithCommas } from "../../../common/helpers/Helper";

@ccclass
export default class RouletteGuide extends cc.Component {

    @property({ type: cc.Label })
    replaceNodes: cc.Label[] = [];

    init(configs) {
        const odds = configs.odds;
        const choiceMaxBet = configs.choices_maxbet;
        const replaceData = {
            "_oddStraightUp": odds.straightUp,
            "_oddSplit": odds.split,
            "_oddStreet": odds.street,
            "_oddCorner": odds.corner,
            "_oddLine": odds.line,
            "_oddDozen": odds.dozen,
            "_oddRedBlack": odds.redBlack,
            "_minBet": numberWithCommas(configs.minbet),
            "_maxBetStraightUp": numberWithCommas(choiceMaxBet.straightUp),
            "_maxBetSplit": numberWithCommas(choiceMaxBet.split),
            "_maxBetStreet": numberWithCommas(choiceMaxBet.street),
            "_maxBetCorner": numberWithCommas(choiceMaxBet.corner),
            "_maxBetLine": numberWithCommas(choiceMaxBet.line),
            "_maxBetDozen": numberWithCommas(choiceMaxBet.dozen),
            "_maxBetRedBlack": numberWithCommas(choiceMaxBet.redBlack),
            "_maxBetRound": numberWithCommas(configs.maxbet)
        }

        this.replaceNodes.forEach(label => {
            Object.keys(replaceData).forEach(key => {
                label.string = label.string.replace(key, replaceData[key]);
            });
        });
    }

    onDisable() {
        this.node.destroy();
    }
}
