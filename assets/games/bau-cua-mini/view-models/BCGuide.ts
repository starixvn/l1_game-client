import { numberWithCommas } from '../../../common/helpers/NumberHelper';
import GameGuideBase from '../../_base/view-models/GameGuideBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BCGuide extends GameGuideBase {
    protected gameConfig = {
        minbet: 10,
        maxbet: 20000,
        odds: {
            oddSingle: 0,
            oddDouble: 0,
            oddTriple: 0
        }
    };

    private gameName = "baucua";

    onLoad() {
        super.onLoad();
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
            this.gameConfig.odds.oddSingle = dataGame.odds[0];
            this.gameConfig.odds.oddDouble = dataGame.odds[1];
            this.gameConfig.odds.oddTriple = dataGame.odds[2];
            this.init(this.gameConfig);
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
