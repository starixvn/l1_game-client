import CascadingSlotTumbleItem from "./CascadingSlotTumbleItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotTicketDetailItem extends cc.Component {
    @property(cc.Label)
    index: cc.Label = null;

    @property(cc.Node)
    resultBoard: cc.Node = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Prefab)
    tumbleWinDetailItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    setData(tumble: any, index: number) {
        let no = 0;
        this.win.string = tumble.win;
        this.index.string = (index + 1).toString();
        Object.entries(tumble.icons).forEach(([key, value]) => {
            const tumbleNode = cc.instantiate(this.tumbleWinDetailItemPrefab);
            const control = tumbleNode.getComponent(CascadingSlotTumbleItem);
            let { count, win } = value as any;
            control.setData(+key, count, win);
            this.content.addChild(tumbleNode);
            no++;
        });
        this.node.height = no * 70;
    }
}
