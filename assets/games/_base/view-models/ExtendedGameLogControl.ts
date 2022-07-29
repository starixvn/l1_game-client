import MiniRoundHistoryItem from "../../../common/mini-round-history/MiniRoundHistoryItem";
import GameLogControlBase from "./GameLogControlBase";

const { ccclass, property } = cc._decorator;

export interface ExtendedLogControlData {
    type: number;
    extra: any;
}

@ccclass
export default class ExtendedGameLogControl extends GameLogControlBase {
    @property({ type: cc.Node, visible: false, override: true })
    items: cc.Node[] = [];

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    createDotNode(type: number) {
        return cc.instantiate(this.itemPrefab);
    }

    setExtendedData(data: ExtendedLogControlData[]) {
        const typeData = data.map((extendedData) => extendedData.type);
        this.setData(typeData);

        this.dots.forEach((dot, index) => {
            const miniRoundHistoryItem = dot.getComponent(MiniRoundHistoryItem);
            if (miniRoundHistoryItem) {
                miniRoundHistoryItem.setData(data[index]);
            } else {
                console.log(`next item index ${index}`);
            }
        });
    }

    override update() {
        // show/hide next item by different way.
    }
}
