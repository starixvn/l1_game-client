import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaccaratGuide extends cc.Component {
    @property({ type: cc.Label })
    replaceNodes: cc.Label[] = [];

    @property(cc.Node)
    mainFrame: cc.Node = null;

    onLoad() {
        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    init(configs) {
        const odds = configs.odds;
        const choiceMaxBet = configs.choices_maxbet;
        const replaceData = {
            _oddPlayer: odds.player,
            _oddBanker: odds.banker,
            _oddBig: odds.big,
            _oddSmall: odds.small,
            _oddTie: odds.tie,
            _oddPair: odds.playerPair,
            _minBet: numberWithCommas(configs.minbet),
            _maxBetMainChoice: numberWithCommas(Math.min(cc.RedT.userStakeLevel.maxBet, configs.maxbet, choiceMaxBet.player)),
            _maxBetSubChoice: numberWithCommas(Math.min(cc.RedT.userStakeLevel.maxBet, configs.maxbet, choiceMaxBet.tie)),
            _maxBetRound: numberWithCommas(Math.min(cc.RedT.userStakeLevel.maxBet, configs.maxbet))
        };

        this.replaceNodes.forEach((label) => {
            Object.keys(replaceData).forEach((key) => {
                label.string = label.string.replace(key, replaceData[key]);
            });
        });
    }
}
