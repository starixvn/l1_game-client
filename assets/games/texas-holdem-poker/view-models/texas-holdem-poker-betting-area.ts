import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import BettingArea, { BettingAreaEvents } from "../../_new/common/betting-area/BettingArea";
import TexasHoldemPokerChoices from "../event-models/texas-holdem-poker-choices";
import { TexasHoldemPokerGameData } from "../event-models/texas-holdem-poker-game-data";

const { ccclass, menu, property } = cc._decorator;

@ccclass
export default class TexasHoldemPokerBettingArea extends BettingArea {
    @property(cc.String)
    betChoice = "";

    @property(cc.Node)
    chipNode: cc.Node = null;

    @property(cc.Node)
    chipWin: cc.Node = null;

    @property(cc.Node)
    winAmount: cc.Node = null;

    @property(cc.Node)
    tooltipPlaceBet: cc.Node = null;

    @property(cc.Node)
    clearBetIcon: cc.Node = null;

    @property(cc.Node)
    betHightLight: cc.Node = null;

    private gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoices> = null;

    init(gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoices>) {
        this.gameData = gameData;
    }

    placingBet() {
        this.node.emit(BettingAreaEvents.PLACING_BET, this.betChoice);
    }

    showTooltip(isShow: boolean) {
        this.tooltipPlaceBet.active = isShow;
        this.betHightLight.active = isShow;
    }

    showBetValue(show: boolean) {
        try {
            this.ownBetsLabel.node.parent.active = show;
        } catch (error) {
            console.log(`ownBetsLabel of ${this.betChoice} null`);
        }
    }

    set ownBets(value: number) {
        if (this.ownBetsLabel) {
            this.ownBetsLabel.string = numberWithCommas(value);
        }
    }
}
