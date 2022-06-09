import GameUtils from "../../../common/GameUtils";
import CascadeSlotReelItem from "./CascadeSlotReelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadeSlotReel extends cc.Component {
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    effectContainer: cc.Node = null;

    @property
    spacing = 15;

    @property
    itemSize = 145;

    itemDisplayCount = 5;

    private items: CascadeSlotReelItem[] = [];
    public readonly pixelPerSecond = 145 * 11;
    private readonly delayMoveEachItem = 0.0;

    createReel() {
        for (let i = 0; i < this.itemDisplayCount; i++) {
            const item = this.addItem();
            item.node.y = this.getItemPosY(i);
        }
    }

    getItems() {
        return this.items;
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

    async spin(data: number[], multiplier: number[], isTurbo: boolean) {
        this.setItemData(data, multiplier);
        this.setStartPositionForItems();
        await this.fallIn(isTurbo);
    }

    getItemPosY(index: number) {
        const start = this.spacing + this.itemSize * 0.5;
        return start + index * (this.spacing + this.itemSize);
    }

    setItemData(data: number[], multiplier: number[]) {
        this.items.forEach((item, index) => {
            item.setItem(data[index], multiplier);
        });
    }

    setStartPositionForItems() {
        this.items.forEach((item, index) => {
            item.node.y = this.getItemPosY(this.itemDisplayCount + index);
        });
    }

    async fallWithOffset(offset: number, isTurbo: boolean) {
        const isFallOut = offset < 0;
        const baseSpeed = isFallOut ? 1.3 * this.pixelPerSecond : this.pixelPerSecond;
        const speed = isTurbo ? baseSpeed * 1.3 : baseSpeed;
        let duration;
        const backOffsetY = this.itemSize * 0.2;
        const backDuration = 0.2;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const posY = this.getItemPosY(i + offset);
            const distance = Math.abs(posY - item.node.y);
            if (distance < 1) {
                continue;
            }
            duration = distance / speed;
            const delay = 0.08 * duration;
            if (!isTurbo) {
                await GameUtils.delayTime(delay);
            }

            if (isFallOut) {
                cc.tween(item.node).to(duration, { y: posY }, { easing: "sineIn" }).start();
            } else {
                cc.tween(item.node)
                    .to(duration, { y: posY - backOffsetY }, { easing: "sineIn" })
                    .by(backDuration, { y: +backOffsetY }, { easing: "sineOut" })
                    .start();
            }
        }

        if (isFallOut) {
            await GameUtils.delayTime(duration);
        } else {
            await GameUtils.delayTime(duration + backDuration);
        }
    }

    async fallOut(isTurbo: boolean) {
        await this.fallWithOffset(-this.itemDisplayCount, isTurbo);
    }

    async fallIn(isTurbo: boolean) {
        await this.fallWithOffset(0, isTurbo);
    }

    getItemNode(index: number): cc.Node {
        const item = this.items[index];
        return item.node;
    }

    async removeItem(index: number) {
        const item = this.items[index];
        GameUtils.moveToOtherNode(item.node, this.effectContainer);
        const animation = item.getComponentInChildren(cc.Animation);
        animation.play();
        const duration = animation.defaultClip.duration;
        await GameUtils.delayTime(duration);
        item.destroy();
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
            if (value === -1) {
                return;
            }
            const item = this.addItem();
            item.setItem(value, []);
            item.node.y = this.getItemPosY(this.itemDisplayCount + i);
            i++;
        });
    }
}
