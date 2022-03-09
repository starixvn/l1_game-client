import HoldemPokerBettingArea from "../../holdem-poker/view-models/HoldemPokerBettingArea";
import { TexasHoldemPokerChoicesType } from "../texas-type";
import TexasHoldemPokerGameData from "../event-models/texas-holdem-poker-game-data";

const { ccclass } = cc._decorator;

@ccclass
export default class TexasHoldemPokerBettingArea extends HoldemPokerBettingArea {
    protected gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoicesType> = null;

    init(gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoicesType>) {
        this.gameData = gameData;
    }

    onLoad() {
        //onload
    }
}
