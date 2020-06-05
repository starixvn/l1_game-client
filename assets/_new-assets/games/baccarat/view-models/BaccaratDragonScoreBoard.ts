import DragonScoreBoard, { DragonScoreBoardItemData } from "../../_base/view-models/DragonScoreBoard";
import BaccaratDragonScoreBoardItem from "./BaccaratDragonScoreBoardItem";

const { ccclass, property } = cc._decorator;

export class BaccaratDragonScoreBoardItemData extends DragonScoreBoardItemData {
    constructor(
        public key: number,
        public isPlayerPair: boolean = false,
        public isBankerPair: boolean = false,
        public isNaturalWin: boolean = false,
        public isTie: boolean = false,
        public tieCount: number = 0,
        public isFirstTie = false) {
        super(key, isTie, tieCount, isFirstTie);
    }
}
@ccclass
export default class BaccaratDragonScoreBoard extends DragonScoreBoard {
    public static readonly BANKER = 0;
    public static readonly PLAYER = 1;

    protected buildItem(result: BaccaratDragonScoreBoardItemData) {
        const item = super.buildItem(result) as BaccaratDragonScoreBoardItem;
        item.playerPair.active = result.isPlayerPair;
        item.bankerPair.active = result.isBankerPair;
        item.natural.active = result.isNaturalWin;

        return item;
    }
}
