import TexasHoldemPokerChoices from "../event-models/texas-holdem-poker-choices";
import { TexasHoldemPokerGameData } from "../event-models/texas-holdem-poker-game-data";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MicroUIAction extends cc.Component {
    @property(cc.Node)
    nodeTree: cc.Node = null;

    protected gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoices> = null;
    public connectGameData(gameData: any) {
        this.gameData = gameData;
    }
    protected handleUI() {}
    start() {
        this.handleUI();
    }
}
