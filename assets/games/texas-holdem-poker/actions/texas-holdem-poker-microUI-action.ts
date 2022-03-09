import { TexasHoldemPokerChoicesType } from "../texas-type";
import  TexasHoldemPokerGameData  from "../event-models/texas-holdem-poker-game-data";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MicroUIAction extends cc.Component {
    @property(cc.Node)
    nodeTree: cc.Node = null;

    protected gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoicesType> = null;
    public connectGameData(gameData: any) {
        this.gameData = gameData;
    }
    protected handleUI() {
        //handle
    }
    start() {
        this.handleUI();
    }
}
