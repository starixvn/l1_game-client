const { ccclass, property } = cc._decorator;

import { numberWithCommas } from "../../../common/helpers/Helper";

@ccclass
export default class RouletteGuide extends cc.Component {

    @property({ type: cc.Label })
    replaceNodes: cc.Label[] = [];

    init(configs) {
        const odds = configs.odds;
        const choiceMaxBet = configs.choices_maxbet;
        // const replaceData = {
        //     "_oddStraightUp": odds.straightUp,
        //     "_oddSplit": odds.split,
        //     "_oddStreet": odds.street,
        //     "_oddCorner": odds.corner,
        //     "_oddDozen": odds.dozen,
        //     "_oddRedBlack": odds.redBlack,
        //     "_minBet": numberWithCommas(configs.minbet),
        //     "_maxBetStraightUp": numberWithCommas(choiceMaxBet.straightUp),
        //     "_maxBetSplit": numberWithCommas(choiceMaxBet.split),
        //     "_maxBetStreet": numberWithCommas(choiceMaxBet.street),
        //     "_maxBetCorner": numberWithCommas(choiceMaxBet.corner),
        //     "_maxBetDozen": numberWithCommas(choiceMaxBet.dozen),
        //     "_maxBetRedBlack": numberWithCommas(choiceMaxBet.redBlack),
        //     "_maxBetRound": numberWithCommas(configs.maxbet)
        // }

        const replaceData = {
            "_oddStraightUp": 36,
            "_oddSplit": 18,
            "_oddStreet": 12,
            "_oddCorner": 9,
            "_oddDozen": 3,
            "_oddRedBlack": 2,
            "_minBet": 1,
            "_maxBetStraightUp": 100,
            "_maxBetSplit": 200,
            "_maxBetStreet": 300,
            "_maxBetCorner": 400,
            "_maxBetDozen": 600,
            "_maxBetRedBlack": numberWithCommas(1000),
            "_maxBetRound": numberWithCommas(1000)
        }

        this.replaceNodes.forEach(label => {
            Object.keys(replaceData).forEach(key => {
                label.string = label.string.replace(key, replaceData[key]);
            });
        });
    }
}
