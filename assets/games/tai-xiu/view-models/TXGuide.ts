import GameGuideBase from '../../_base/view-models/GameGuideBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class TXGuide extends GameGuideBase {
    private gameConfig = {
        minbet: 10,
        maxbet: 20000,
        odds: {
            even: 1.96
        }
    };

    onLoad() {
        super.onLoad();

        this.init(this.gameConfig);
    }

    createReplaceData(configs) {
        return {
            _maxBetRound: configs.maxbet + this.siteCurrent,
            _minBet: configs.minbet + this.siteCurrent,
            _maxBet: configs.maxbet + this.siteCurrent,
            _oddEven: configs.odds.even,
            _siteCurrency: this.siteCurrent
        };
    }
}
