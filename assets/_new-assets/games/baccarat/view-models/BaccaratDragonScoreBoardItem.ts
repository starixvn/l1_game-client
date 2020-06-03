import DragonScoreBoardItem from "../../_base/view-models/DragonScoreBoardItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaccaratDragonScoreBoardItem extends DragonScoreBoardItem {
    @property(cc.Node)
    playerPair: cc.Node = null;

    @property(cc.Node)
    bankerPair: cc.Node = null;

    @property(cc.Node)
    natural: cc.Node = null;
}
