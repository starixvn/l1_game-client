import { GameBaseConfigs } from "../../../../_new-assets/games/_base/GameBaseConfig";
import MiniKeno from "../../../../_new-assets/games/mini-keno/view-models/MiniKeno";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoPageIndicatorItem extends cc.Component {

    @property(cc.Sprite)
    dot: cc.Sprite = null;

    @property({ type: cc.SpriteFrame })
    dotFrames: cc.SpriteFrame[] = [];

    private highlighted = false;
    private miniKeno: MiniKeno;

    init(miniKeno: MiniKeno) {
        this.miniKeno = miniKeno;
    }

    onLoad() {
        this.updateImage();
        this.schedule(this.updateImage, 1);
    }

    public setHighlight(highlight: boolean) {
        this.highlighted = highlight;
        this.updateImage();
    }

    public updateImage() {
        const config = this.miniKeno.config;
        if (this.miniKeno.currentTimeRemaining <= config.stopBetTime) {
            this.dot.spriteFrame = this.dotFrames[0];
            this.dot.node.color = cc.Color.RED;
            return;
        }
        if (this.miniKeno.currentTimeRemaining > config.betTime && this.miniKeno.currentTimeRemaining <= config.fullTime) {
            this.dot.spriteFrame = this.dotFrames[0];
            this.dot.node.color = cc.Color.YELLOW;
            return;
        }

        this.dot.spriteFrame = this.highlighted ? this.dotFrames[0] : this.dotFrames[1];
        this.dot.node.color = cc.Color.WHITE;
    }
}
