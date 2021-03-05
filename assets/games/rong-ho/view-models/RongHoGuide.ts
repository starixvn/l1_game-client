import { lazyInject } from "../../../Application";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import OldMiniGameConfig from "../../_base/view-models/OldMiniGameConfig";
import GameGuideBase from "../../_base/view-models/GameGuideBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHoGuide extends GameGuideBase {
    @lazyInject(OldMiniGameConfig)
    private readonly oldMiniGameConfig: OldMiniGameConfig;

    protected gameConfigs;

    private readonly odds = {
        dragon: 2,
        tie: 11
    };

    onLoad() {
        super.onLoad();
        this.gameConfigs = this.oldMiniGameConfig.gameConfigs;
        this.gameConfigs.choices_maxbet = this.oldMiniGameConfig.dragonTigerChoicesMaxbet;
        this.gameConfigs.odds = this.odds;
        this.init(this.gameConfigs);
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
