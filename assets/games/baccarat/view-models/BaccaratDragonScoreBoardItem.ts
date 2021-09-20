import DragonScoreBoardItem from "../../_base/view-models/DragonScoreBoardItem";
import { BaccaratDragonScoreBoardItemData } from "./BaccaratDragonScoreBoard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaccaratDragonScoreBoardItem extends DragonScoreBoardItem {
    @property(cc.Node)
    playerPair: cc.Node = null;

    @property(cc.Node)
    bankerPair: cc.Node = null;

    @property(cc.Node)
    natural: cc.Node = null;

    setData(result: BaccaratDragonScoreBoardItemData) {
        this.playerPair.active = result.isPlayerPair;
        this.bankerPair.active = result.isBankerPair;
        this.natural.active = result.isNaturalWin && !result.isFirstTie;
    }
}
