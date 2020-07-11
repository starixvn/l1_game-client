import helpers from './../../../common/helpers/Helper.js';

cc.Class({
    extends: cc.Component,

    properties: {
        replaceNodes: {
            default: [],
            type: cc.Label
        }
    },

    closeGuide: function () {
        this.node.destroy();
    },

    init: function (configs) {
        this.configs = configs;

        const odds = this.configs.odds;
        const choiceMaxBet = this.configs.choices_maxbet;
        const replaceData = {
            "_oddsMain": odds.even,
            "_oddsRed4": odds.red4,
            "_oddsRed3": odds.red3,
            "_minBet": helpers.numberWithCommas(this.configs.minbet),
            "_maxBetMain": helpers.numberWithCommas(choiceMaxBet.even),
            "_maxBetRed4": helpers.numberWithCommas(choiceMaxBet.red4),
            "_maxBetRed3": helpers.numberWithCommas(choiceMaxBet.red3),
            "_maxBetRound": helpers.numberWithCommas(this.configs.maxbet)
        }

        this.replaceNodes.forEach(label => {
            Object.keys(replaceData).forEach(key => {
                label.string = label.string.replace(key, replaceData[key]);
            });
        });
    }
});
