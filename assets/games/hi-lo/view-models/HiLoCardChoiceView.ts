const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoCardChoiceView extends cc.Component {
    @property(cc.Label)
    rank: cc.Label = null;

    @property(cc.Sprite)
    suit: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    prefix = "result_highlight_";

    setData(rank: string, suit: number) {
        const keys = [0, 1, 2, 3];
        const suffix = ["diamond", "heart", "club", "spade"];
        keys.forEach((key, i) => {
            if (suit === key) {
                this.suit.spriteFrame = this.atlas.getSpriteFrame(`${this.prefix}${suffix[i]}`);
            }
        });
        if (suit === 0 || suit === 1) {
            this.rank.node.color = new cc.Color(255, 4, 4);
        }
        this.rank.string = rank;
    }
}
