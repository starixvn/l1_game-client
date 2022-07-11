const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayContainer extends cc.Component {
    normalPrefabs: cc.Prefab[] = [];
    smallPrefabs: cc.Prefab[] = [];

    gameIds: number[] = [];
}
