const { ccclass, property } = cc._decorator;
import { numberWithCommas } from "./../../../common/helpers/Helper";

@ccclass
export default class BlackJackGuide extends cc.Component {

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
        const replaceData = {
            "_oddsRegular": odds.regular,
            "_oddsBlackjack": odds.blackjack,
            "_minBet": numberWithCommas(this.configs.minbet),
            "_maxBet": numberWithCommas(this.configs.maxbet)
        }

        return replaceData;
    }

    onDisable() {
        this.node.destroy();
    }
}
