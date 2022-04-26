import _ = require("lodash");

import GameUtils from "../../../common/GameUtils";
import CascadeSlotReel from "./CascadeSlotReel";

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
        console.log(shuffleData);
        this.reels.forEach((reel, index) => {
            const start = index * reel.itemDisplayCount;
            const end = start + reel.itemDisplayCount;
            const itemData = shuffleData.slice(start, end);
            console.log(itemData);
            reel.setItemData(itemData);
        });
    }

    //not used
    // async spinGenrations(data: GenerationData[]) {
    //     let i = 0;
    //     await this.spinResult(data[i].symbols);

    //     while (i < data.length - 1) {
    //         const removedSymbols = data[i].removedSymbols;
    //         //show win items here
    //         await GameUtils.delayTime(0.5);
    //         await this.removeItems(removedSymbols);
    //         const addItems = data[i + 1].symbols;
    //         this.addItems(addItems);
    //         await this.fallIn();

    //         i++;
    //     }

    //     //show total win here
    // }

    public async spinResult(symbols: number[][]) {
        const delay = 0.1;
        for (let i = 0; i < this.reels.length; i++) {
            await GameUtils.delayTime(delay);
            const waitToChangeItem = delay * (this.reels.length - 1 - i);
            if (i < this.reels.length - 1) {
                this.reels[i].spin(symbols[i], waitToChangeItem);
            } else {
                await this.reels[i].spin(symbols[i], waitToChangeItem);
            }
        }
    }

    public async removeItems(data: number[][]) {
        await Promise.all(
            this.reels.map(async (reel, index) => {
                const items = data[index]
                    .map((item, index) => {
                        return item !== null ? index : -1;
                    })
                    .filter((value) => value > -1);
                await reel.removeItemsByIndex(items);
            })
        );
    }

    public addItems(data: number[][]) {
        this.reels.forEach(async (reel, index) => {
            const items = data[index];
            reel.addItems(items);
        });
    }

    public async fallIn() {
        await Promise.all(
            this.reels.map(async (reel) => {
                await reel.fallIn();
            })
        );
    }
}
