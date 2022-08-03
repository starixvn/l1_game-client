import BlinkNode from "../../../common/BlinkNode";
import MiniRoundHistoryItem from "../../../common/mini-round-history/MiniRoundHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BeadRoadItem extends MiniRoundHistoryItem {
    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Sprite)
    extraInfo: cc.Sprite = null;

    public setData(data: any) {
        if (data === null) {
            this.icon.spriteFrame = this.atlas.getSpriteFrame("pending-icon");
            this.extraInfo && (this.extraInfo.spriteFrame = null);
            this.icon.node.color = cc.Color.GRAY;
            this.icon.addComponent(BlinkNode).interval = 0.5;
            return;
        }

        const { type, extra } = data;
        const dict = {
            0: "big-icon",
            1: "small-icon"
        };
        this.icon.spriteFrame = this.atlas.getSpriteFrame(dict[type]);
        this.extraInfo && (this.extraInfo.spriteFrame = this.atlas.getSpriteFrame(`big_small_num_${extra.sum}`));
    }
}
