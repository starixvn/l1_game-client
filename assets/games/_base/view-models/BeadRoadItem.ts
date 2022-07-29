import BlinkNode from "../../../common/BlinkNode";
import MiniRoundHistoryItem from "../../../common/mini-round-history/MiniRoundHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BeadRoadItem extends MiniRoundHistoryItem {
    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    label: cc.Label = null;

    public setData(data: any) {
        if (data === null) {
            this.icon.spriteFrame = this.atlas.getSpriteFrame("dot-white");
            this.label.string = "";
            this.icon.node.color = cc.Color.GRAY;
            this.icon.addComponent(BlinkNode).interval = 0.5;
            return;
        }

        const { type, extra } = data;
        const dict = {
            0: "dot-black",
            1: "dot-white"
        };
        this.icon.spriteFrame = this.atlas.getSpriteFrame(dict[type]);
        this.label.string = `${extra.sum}`;
    }
}
