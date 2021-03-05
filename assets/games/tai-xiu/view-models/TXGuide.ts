import { lazyInject } from "../../../Application";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import OldMiniGameConfig from "../../_base/view-models/OldMiniGameConfig";
import GameGuideBase from "../../_base/view-models/GameGuideBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TXGuide extends GameGuideBase {
    @lazyInject(OldMiniGameConfig)
    private readonly oldMiniGameConfig: OldMiniGameConfig;

    onLoad() {
        super.onLoad();

        this.init(this.oldMiniGameConfig.gameConfigs);
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
