import { lazyInject } from '../../../Application';
import { numberWithCommas } from '../../../common/helpers/NumberHelper';
import OldMiniGameConfig from '../../_base/OldMiniGameConfig';
import GameGuideBase from '../../_base/view-models/GameGuideBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BCGuide extends GameGuideBase {
    @lazyInject(OldMiniGameConfig)
    private readonly oldMiniGameConfig: OldMiniGameConfig;

    protected gameConfigs;
    private defaultOdds = {
        oddSingle: 0,
        oddDouble: 0,
        oddTriple: 0
    };
    private gameName = "baucua";

    onLoad() {
        super.onLoad();
        this.gameConfigs = this.oldMiniGameConfig.gameConfigs;
        this.gameConfigs.odds = this.defaultOdds;
        this.getOdds();
        cc.RedT.addDataObserver(`${this.gameName}_guide`, (data) => this.receivedData(data));
    }

    onDestroy() {
        cc.RedT.removeDataObserver(`${this.gameName}_guide`);
    }

    getOdds() {
        cc.RedT.send({
            g: {
                baucua: {
                    get_odd: true
                }
            }
        });
    }

    receivedData(data) {
        const dataGame = data[this.gameName] || (data.mini && data.mini[this.gameName]);
        if (dataGame && dataGame.odds && dataGame.odds.length > 0) {
            this.gameConfigs.odds.oddSingle = dataGame.odds[0];
            this.gameConfigs.odds.oddDouble = dataGame.odds[1];
            this.gameConfigs.odds.oddTriple = dataGame.odds[2];
            this.init(this.gameConfigs);
        }
    }

    createReplaceData(configs) {
        return {
            _maxBetRound: numberWithCommas(configs.maxbet),
            _minBet: configs.minbet,
            _maxBet: numberWithCommas(configs.maxbet),
            _oddSingle: configs.odds.oddSingle,
            _oddDouble: configs.odds.oddDouble,
            _oddTriple: configs.odds.oddTriple
        };
    }
}
