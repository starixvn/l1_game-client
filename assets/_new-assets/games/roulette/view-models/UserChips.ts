const { ccclass, property } = cc._decorator;

@ccclass
export default class UserChips extends cc.Component {
    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    userBalance: cc.Label = null;

    @property(cc.Sprite)
    userAvatar: cc.Sprite = null;

    @property(cc.Prefab)
    winningPlayerEffectPrefab: cc.Prefab = null;

    @property(cc.Node)
    betChipsContainer: cc.Node = null;

    @property(cc.Prefab)
    betChipsPrefab: cc.Prefab = null;

    start() {

    }
}
