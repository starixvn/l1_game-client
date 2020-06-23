const { ccclass, property } = cc._decorator;

import { numberWithCommas } from "../../../common/helpers/Helper";

@ccclass
export default class KenoGuide extends cc.Component {

    @property({ type: cc.Label })
    replaceNodes: cc.Label[] = [];

    init(configs) {
        const odds = configs.odds;
        const choiceMaxBet = configs.choices_maxbet;
        const replaceData = {
            "_oddBig": odds.big,
            "_oddEarth": odds.earth,
            "_oddFire": odds.fire,
            "_oddWater": odds.water,
            "_oddGold": odds.gold,
            "_oddWood": odds.wood,
            "_minBet": numberWithCommas(configs.minbet),
            "_maxBetBig": numberWithCommas(choiceMaxBet.big),
            "_maxBetGold": numberWithCommas(choiceMaxBet.gold),
            "_maxBetWood": numberWithCommas(choiceMaxBet.wood),
            "_maxBetWater": numberWithCommas(choiceMaxBet.water),
            "_maxBetFire": numberWithCommas(choiceMaxBet.fire),
            "_maxBetEarth": numberWithCommas(choiceMaxBet.earth),
            "_maxBetRound": numberWithCommas(configs.maxbet)
        }

        this.replaceNodes.forEach(label => {
            Object.keys(replaceData).forEach(key => {
                label.string = label.string.replace(key, replaceData[key]);
            });
        });
    }

    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }
    }
}
