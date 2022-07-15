import GameViewBase from "../../_base/GameViewBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayGame extends GameViewBase {
    normalPrefabs: cc.Prefab[] = [];
    smallPrefabs: cc.Prefab[] = [];
    gameIds: number[] = [];
}
