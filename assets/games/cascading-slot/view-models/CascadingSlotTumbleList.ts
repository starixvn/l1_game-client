import CascadingSlotTumbleItem from "./CascadingSlotTumbleItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotTumbleList extends cc.Component {
    @property(cc.Prefab)
    tumbleItem: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    onLoad() {
        const icons = {
            "8": { count: 6, win: 10 },
            "9": { count: 6, win: 10 }
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
        this.content.height = 50 * index;
    }
}
