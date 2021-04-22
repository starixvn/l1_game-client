import { ThreeCardsResultData } from "./DataDefinition";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ThreeCardsResultItem extends cc.Component {
    @property({ type: cc.Sprite })
    icons: cc.Sprite[] = [];

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property
    prefix = "result_icon_";

    private readonly suffix = ["heart", "diamond", "club", "spade"];

    setData(data: ThreeCardsResultData) {
        const iconsCount = this.icons.length;
        data.forEach((icon, index) => {
            if (index >= iconsCount) {
                return;
            }

            this.icons[index].spriteFrame = this.atlas.getSpriteFrame(`${this.prefix}${this.suffix[icon]}`);
        });
    }
}
