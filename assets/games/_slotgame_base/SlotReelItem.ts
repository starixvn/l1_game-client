const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotReelItem extends cc.Component {
    @property(cc.Prefab)
    itemPrefabs: cc.Prefab[] = [];

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    winningEffect: cc.Node = null;

    public index = -1;

    onLoad() {
        this.showWinningEffect(false);
    }

    setItem(index: number) {
        if (index === this.index) {
            return;
        }
        this.index = index;
        this.content.removeAllChildren();
        const node = cc.instantiate(this.itemPrefabs[index]);
        this.content.addChild(node);
    }

    showWinningEffect(show = true) {
        this.winningEffect.active = show;
    }
}
