import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import GameGuideBase from "../../_base/view-models/GameGuideBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipSedieWarGuide extends GameGuideBase {
    createReplaceData(configs) {
        const odds = configs.odds;
        const choiceMaxBet = configs.choices_maxbet;
        return {
            _oddsPlayerEven: odds.playerEven,
            _oddsPlayerRed3: odds.playerRed3,
            _oddsPlayerRed4: odds.playerRed4,
            _oddsBankerEven: odds.bankerEven,
            _oddsBankerRed3: odds.bankerRed3,
            _oddsBankerRed4: odds.bankerRed4,
            _oddsPlayer: odds.player,
            _oddsTie: odds.tie,
            _oddsEven: odds.even,
            _minBet: numberWithCommas(configs.minbet),
            _maxBetRound: numberWithCommas(configs.maxbet),
            _maxBetPlayerRed4: numberWithCommas(choiceMaxBet.playerRed4),
            _maxBetBankerRed4: numberWithCommas(choiceMaxBet.bankerRed4),
            _maxBetPlayerEven: numberWithCommas(choiceMaxBet.playerEven),
            _maxBetPlayerRed3: numberWithCommas(choiceMaxBet.playerRed3),
            _maxBetBankerEven: numberWithCommas(choiceMaxBet.bankerEven),
            _maxBetBankerRed3: numberWithCommas(choiceMaxBet.bankerRed3),
            _maxBetPlayer: numberWithCommas(choiceMaxBet.player),
            _maxBetBanker: numberWithCommas(choiceMaxBet.banker)
        };
    }
}
