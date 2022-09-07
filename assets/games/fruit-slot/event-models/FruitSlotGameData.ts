import { GameData } from "../../_new/_base/game-data-management/models/game-data";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FruitSlotGameData extends GameData {
    static Events = {
        SETTLED: "settled"
    };
}
