import { numberWithCommas } from '../../../common/helpers/Helper';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaccaratGuide extends cc.Component {

    @property({ type: cc.Label })
    replaceNodes: cc.Label[] = [];

    @property(cc.Node)
    mainFrame: cc.Node = null;

    onLoad() {
        const commonDialog = this.mainFrame.getComponent('CommonDialog');
        commonDialog.onDidHide = () => { this.node.destroy(); };
    }

    init(configs) {
        const odds = configs.odds;
        const choiceMaxBet = configs.choices_maxbet;
        const replaceData = {
            "_oddPlayer": odds.player,
            "_oddBanker": odds.banker,
            "_oddBig": odds.big,
            "_oddSmall": odds.small,
            "_oddTie": odds.tie,
            "_oddPair": odds.playerPair,
            "_minBet": numberWithCommas(configs.minbet),
            "_maxBetMainChoice": numberWithCommas(choiceMaxBet.player),
            "_maxBetSubChoice": numberWithCommas(choiceMaxBet.tie),
            "_maxBetRound": numberWithCommas(configs.maxbet)
        }

        this.replaceNodes.forEach(label => {
            Object.keys(replaceData).forEach(key => {
                label.string = label.string.replace(key, replaceData[key]);
            });
        });
    }
}
