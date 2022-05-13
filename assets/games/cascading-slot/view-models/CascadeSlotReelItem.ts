import MultiplierItem from "./MultiplierItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadeSlotReelItem extends cc.Component {
    @property(cc.Prefab)
    itemPrefabs: cc.Prefab[] = [];

    @property(cc.Node)
    content: cc.Node = null;

    public index = -1;

    setItem(index: number, multiplier: number[]) {
        if (index === this.index) {
            return;
        }
        this.index = index;
        this.replaceItem(index);
        if (index === 10) {
            const m = multiplier.shift();
            const multiplierItem = this.content.children[0].getComponent(MultiplierItem);
            multiplierItem.setValue(m);
        }
    }

    private replaceItem(index: number) {
        this.content.removeAllChildren();
        const node = cc.instantiate(this.itemPrefabs[index]);
        this.content.addChild(node);
    }
}
