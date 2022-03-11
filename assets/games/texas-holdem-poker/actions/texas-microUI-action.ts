import { TexasChoicesType } from "../texas-type";
import TexasGameDataModel from "../event-models/texas-game-data-model";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TexasMicroUIAction extends cc.Component {
    @property(cc.Node)
    nodeTree: cc.Node = null;

    protected gameData: TexasGameDataModel<TexasChoicesType> = null;
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
