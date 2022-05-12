import CascadingSlotTumbleItem from "./CascadingSlotTumbleItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotTumbleList extends cc.Component {
    @property(cc.Prefab)
    tumbleItem: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    private HEIGHT_PER_ROW = 35;

    onLoad() {
        const icons = {
            "1": { count: 10, win: 0.55 },
            "2": { count: 19, win: 0.55 },
            "3": { count: 8, win: 1.28 },
            "4": { count: 8, win: 1.28 },
            "5": { count: 8, win: 1.28 },
            "6": { count: 8, win: 1.28 },
            "7": { count: 8, win: 1.28 },
            "8": { count: 8, win: 1.28 }
        };
        this.handleTumbleList(icons);
    }
    handleTumbleList(icons: any) {
        let index = 0;
        Object.entries(icons).forEach(([key, value]) => {
            const tumbleNode = cc.instantiate(this.tumbleItem);
            const control = tumbleNode.getComponent(CascadingSlotTumbleItem);
            const subArr = [];
            for (let subValue of Object.values(value)) {
                subArr.push(subValue);
            }
            control.setData(+key, subArr[0], subArr[1]);
            this.content.addChild(tumbleNode);
            index++;
        });
        this.content.height = this.HEIGHT_PER_ROW * index;
    }
}
