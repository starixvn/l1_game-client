import GameUtils from "../../common/GameUtils";
import { SlotGameBaseConfigs } from "./SlotGameBaseConfigs";
import SlotReelItem from "./SlotReelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotReel extends cc.Component {
    @property
    itemCount = 18;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property
    itemDisplayCount = 3;

    items: SlotReelItem[] = [];

    public slotGameConfig: SlotGameBaseConfigs;
    public winningContainer: cc.Node;
    private layout: cc.Layout;
    private itemHeight = 0;
    private spacingY = 0;

    public get itemTypeCount() {
        return this.items[0].itemPrefabs.length || 0;
    }

    onLoad() {
        this.layout = this.node.getComponent(cc.Layout);
        this.spacingY = this.layout.spacingY;

        this.createReel();
    }

    createReel() {
        for (let i = 0; i < this.itemCount; i++) {
            const node = cc.instantiate(this.itemPrefab);
            this.node.addChild(node);
            const item = node.getComponent(SlotReelItem);
            this.items.push(item);
            const random = Math.floor(Math.random() * this.itemTypeCount);
            item.setItem(random);
        }

        this.itemHeight = this.items[0].node.height;
        this.layout.updateLayout();
        this.layout.enabled = false;
    }

    setReelData(items: number[]) {
        items.forEach((row, index) => {
            this.getItemTop(index).setItem(row);
            this.getItemBottom(index).setItem(row);
        });
    }

    private getMovingOffset(): number {
        const offsetHeight = 3 * this.itemHeight + 2 * this.spacingY;
        return -(this.node.height - offsetHeight);
    }

    spin(spinDuration = 1) {
        const offset = this.getMovingOffset();
        const moving = cc.moveTo(spinDuration, cc.v2(this.node.x, offset)).easing(cc.easeInOut(3));
        this.node.runAction(
            cc.sequence(
                moving,
                cc.callFunc(() => this.onSpinFinish())
            )
        );
    }

    stop() {
        this.node.stopAllActions();
        this.onSpinFinish();
    }

    onSpinFinish() {
        for (let i = 0; i < this.itemDisplayCount; i++) {
            const bottomItem = this.getItemBottom(i);
            const topItem = this.getItemTop(i);
            bottomItem.setItem(topItem.index);
        }
        this.node.y = 0;
    }

    getItemBottom(index: number) {
        return this.items[this.itemCount + index - this.itemDisplayCount];
    }

    getItemTop(index: number) {
        return this.items[index];
    }

    showWinningEffect(index: number, symbol: number) {
        const item = this.getItemBottom(index);
        const itemCopy = this.getItemTop(index);
        const highlight =
            item.index === symbol || (item.index === this.slotGameConfig.wildSymbol && symbol !== this.slotGameConfig.jackpotSymbol);
        item.showWinningEffect(highlight);
        itemCopy.showWinningEffect(highlight);
        GameUtils.moveToOtherNode(item.node, this.winningContainer);
    }

    hideWinningEffect() {
        this.items.forEach((item) => {
            GameUtils.moveToOtherNode(item.node, this.node);
            item.showWinningEffect(false);
        });
    }

    showHighlightSpecialSymbols(symbol: number) {
        for (let i = 0; i < this.itemDisplayCount; i++) {
            const item = this.getItemBottom(i);
            if (item.index === symbol) {
                GameUtils.moveToOtherNode(item.node, this.winningContainer);
                item.showWinningEffect(true);
                break;
            }
        }
    }
}
