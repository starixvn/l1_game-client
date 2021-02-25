import { numberWithCommas } from '../../../common/helpers/NumberHelper';
import GameGuideBase from '../../_base/view-models/GameGuideBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHoGuide extends GameGuideBase {
    protected gameConfig = {
        minbet: 10,
        maxbet: 20000,
        choices_maxbet: {
            dragon: 20000,
            tie: 2000
        },
        odds: {
            dragon: 2,
            tie: 11
        }
    };

    onLoad() {
        super.onLoad();
        this.init(this.gameConfig);
    }

    createReplaceData(configs) {
        return {
            _maxBetRound: numberWithCommas(configs.maxbet),
            _maxBetDragon: numberWithCommas(configs.choices_maxbet.dragon),
            _maxBetTie: numberWithCommas(configs.choices_maxbet.tie),
            _minBet: configs.minbet,
            _maxBet: numberWithCommas(configs.maxbet),
            _oddDragon: configs.odds.dragon,
            _oddTie: configs.odds.tie
        };
    }
}
