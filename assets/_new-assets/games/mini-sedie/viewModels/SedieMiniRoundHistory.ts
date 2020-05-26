import SedieRoundHistoryTip from "./SedieRoundHistoryTip";
import SedieRoundHistoryItem from "./SedieRoundHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieMiniRoundHistory extends cc.Component {
    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(SedieRoundHistoryTip)
    tip: SedieRoundHistoryTip = null;

    @property(cc.SpriteFrame)
    dotRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dotWhite: cc.SpriteFrame = null;

    private items: SedieRoundHistoryItem[] = [];

    private listener = {
        onEnter: (node: cc.Node) => {
            let red = node.getComponent(SedieRoundHistoryItem).red;
            this.tip.node.position.x = node.x;
            this.tip.setData(red);
        },
        onLeave: (node: cc.Node) => {
            this.tip.show(false);
        },
    }

    onLoad() {
        this.items = this.content.getComponentsInChildren(SedieRoundHistoryItem);
        this.items.forEach(item => item.listener = this.listener);
    }

    public setData(redData: number[]) {
        this.items.forEach((item, index) => {
            let value = redData[index];
            item.setValue(value);

            item.getComponent(cc.Sprite).spriteFrame = value % 2 === 0 ? this.dotWhite : this.dotRed;
        });
    }
}
