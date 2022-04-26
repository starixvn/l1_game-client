const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadeSlotReelItem extends cc.Component {
    @property(cc.Prefab)
    itemPrefabs: cc.Prefab[] = [];

    @property(cc.Node)
    content: cc.Node = null;

    public index = -1;

    setItem(index: number) {
        if (index === this.index) {
            return;
        }
        this.index = index;
        this.replaceItem(index);
    }

    private replaceItem(index: number) {
        this.content.removeAllChildren();
        const node = cc.instantiate(this.itemPrefabs[index]);
        this.content.addChild(node);
    }
}
