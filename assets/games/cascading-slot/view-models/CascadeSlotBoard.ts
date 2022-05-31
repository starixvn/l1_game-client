import _ = require("lodash");

import GameUtils from "../../../common/GameUtils";
import CascadeSlotReel from "./CascadeSlotReel";
import MultiplierItem from "./MultiplierItem";

const { ccclass, property } = cc._decorator;

interface GenerationData {
    symbols: number[][];
    removedSymbols: number[][];
}

@ccclass
export default class CascadeSlotBoard extends cc.Component {
    @property
    itemTypeCount = 11;

    private reels: CascadeSlotReel[] = [];

    private readonly itemDisplayCount = 5;

    onLoad() {
        this.createReels();
        this.initBoardFullItems();
    }

    private createReels() {
        this.node.children.forEach((child) => {
            const slotReel = child.getComponent(CascadeSlotReel);
            if (slotReel) {
                slotReel.itemDisplayCount = this.itemDisplayCount;
                slotReel.createReel();
                this.reels.push(slotReel);
            }
        });
    }

    private initBoardFullItems() {
        const data = [];
        const itemTypeCount = this.itemTypeCount || 0;

        const boardSize = this.reels.length * this.itemDisplayCount;
        for (let i = 0; i < boardSize; i++) {
            if (i < itemTypeCount) {
                data.push(i);
            } else {
                data.push(Math.floor(Math.random() * itemTypeCount));
            }
        }

        const shuffleData = _.shuffle(data);
        this.reels.forEach((reel, index) => {
            const start = index * reel.itemDisplayCount;
            const end = start + reel.itemDisplayCount;
            const itemData = shuffleData.slice(start, end);
            reel.setItemData(itemData, []);
        });
    }

    public setData(symbols: number[][], multiplier: number[]) {
        for (let i = 0; i < this.reels.length; i++) {
            this.reels[i].setItemData(symbols[i], multiplier);
        }
    }

    public async spinResult(symbols: number[][], multiplier: number[], isTurbo: boolean) {
        const delay = 0;
        for (let i = 0; i < this.reels.length; i++) {
            if (!isTurbo) {
                await GameUtils.delayTime(delay);
            }
            if (i < this.reels.length - 1) {
                this.reels[i].spin(symbols[i], multiplier);
            } else {
                await this.reels[i].spin(symbols[i], multiplier);
            }
        }
    }

    getRandomWinItem(data: number[][], winIcon: number): cc.Node {
        const list = [];
        for (let i = 0; i < this.reels.length; i++) {
            const reelData = data[i];
            for (let j = 0; j < reelData.length; j++) {
                if (reelData[j] === winIcon) {
                    list.push({ i, j });
                }
            }
        }
        const randomIndex = _.random(0, list.length - 1, false);
        const randomItem = list[randomIndex];
        return this.reels[randomItem.i].getItemNode(randomItem.j);
    }

    public async removeItems(data: number[][]) {
        await Promise.all(
            this.reels.map(async (reel, index) => {
                const items = data[index]
                    .map((item, index) => {
                        return item !== -1 ? index : -1;
                    })
                    .filter((value) => value > -1);
                await reel.removeItemsByIndex(items);
            })
        );
    }

    public getItems() {
        const items = this.reels.flatMap((reel) => {
            return reel.getItems();
        });

        return items;
    }

    public addItems(data: number[][]) {
        this.reels.forEach((reel, index) => {
            const items = data[index];
            reel.addItems(items);
        });
    }

    public getMultiplierItems() {
        const items = this.getItems();
        const multiplierItems = items.flatMap((item) => {
            const comp = item.content.children[0].getComponent(MultiplierItem);
            return comp ? [comp] : [];
        });
        return multiplierItems;
    }

    public async fallIn() {
        await Promise.all(
            this.reels.map(async (reel) => {
                await reel.fallIn();
            })
        );
    }
}
