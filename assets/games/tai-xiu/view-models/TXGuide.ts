import { numberWithCommas } from '../../../common/helpers/NumberHelper';
import GameGuideBase from '../../_base/view-models/GameGuideBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class TXGuide extends GameGuideBase {
    private readonly gameConfig = {
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
            _maxBetRound: numberWithCommas(configs.maxbet),
            _minBet: configs.minbet,
            _maxBet: numberWithCommas(configs.maxbet),
            _oddEven: configs.odds.even
        };
    }
}
