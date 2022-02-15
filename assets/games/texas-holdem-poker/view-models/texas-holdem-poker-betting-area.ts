import HoldemPokerBettingArea from "../../holdem-poker/view-models/HoldemPokerBettingArea";
import TexasHoldemPokerChoices from "../event-models/texas-holdem-poker-choices";
import { TexasHoldemPokerGameData } from "../event-models/texas-holdem-poker-game-data";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TexasHoldemPokerBettingArea extends HoldemPokerBettingArea {
    protected gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoices> = null;

    init(gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoices>) {
        this.gameData = gameData;
    }

    onLoad() {}
}
