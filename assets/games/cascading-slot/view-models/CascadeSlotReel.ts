import GameUtils from "../../../common/GameUtils";
import CascadeSlotReelItem from "./CascadeSlotReelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadeSlotReel extends cc.Component {
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property
    spacing = 15;

    @property
    itemSize = 145;

    itemDisplayCount = 5;

    private items: CascadeSlotReelItem[] = [];
    private readonly speed = 145 / 0.1;
    private readonly delayMoveEachItem = 0.05;

    createReel() {
        for (let i = 0; i < this.itemDisplayCount; i++) {
            const item = this.addItem();
            item.node.y = this.getItemPosY(i);
        }
    }

    addItem() {
        const node = this.createReelItem();
        const item = node.getComponent(CascadeSlotReelItem);
        this.items.push(item);
        return item;
    }

    createReelItem(): cc.Node {
        const node = cc.instantiate(this.itemPrefab);
        this.node.addChild(node);
        return node;
    }

    async spin(data: number[], delay: number) {
        await this.fallOut();
        await GameUtils.delayTime(delay);
        this.setItemData(data);
        this.setStartPositionForItems();
        await this.fallIn();
    }

    getItemPosY(index: number) {
        const start = this.spacing + this.itemSize * 0.5;
        return start + index * (this.spacing + this.itemSize);
    }

    get duration() {
        const height = (this.itemSize + this.spacing) * this.itemDisplayCount + this.spacing;
        return height / this.speed;
    }

    setItemData(data: number[]) {
        this.items.forEach((item, index) => {
            item.setItem(data[index]);
        });
    }

    setStartPositionForItems() {
        this.items.forEach((item, index) => {
            item.node.y = this.getItemPosY(this.itemDisplayCount + index);
        });
    }

    async fallWithOffset(offset: number) {
        for (let i = 0; i < this.items.length; i++) {
            await GameUtils.delayTime(this.delayMoveEachItem * i);
            const item = this.items[i];
            cc.tween(item.node)
                .to(this.duration, { y: this.getItemPosY(i + offset) })
                .start();
        }

        await GameUtils.delayTime(this.duration);
    }

    async fallOut() {
        await this.fallWithOffset(-this.itemDisplayCount);
    }

    async fallIn() {
        await this.fallWithOffset(0);
    }

    async removeItem(index: number) {
        const item = this.items[index];
        const hideDuration = 0.3;
        cc.tween(item.node)
            .to(hideDuration, { scale: 0 })
            .call(() => item.destroy())
            .start();
        await GameUtils.delayTime(hideDuration);
    }

    async removeItemsByIndex(list: number[]) {
        for (let i = 0; i < list.length; i++) {
            if (i < list.length - 1) {
                this.removeItem(list[i]);
            } else {
                await this.removeItem(list[i]);
            }
        }

        this.items = this.items.filter((item, index) => !list.includes(index));
    }

    addItems(data: number[]) {
        let i = 0;
        data.forEach((value) => {
            if (value === null) {
                return;
            }
            const item = this.addItem();
            item.setItem(value);
            item.node.y = this.getItemPosY(this.itemDisplayCount + i);
            i++;
        });
    }
}
