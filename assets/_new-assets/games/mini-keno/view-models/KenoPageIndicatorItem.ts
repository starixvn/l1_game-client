import { GameBaseConfigs } from "../../../../_new-assets/games/_base/GameBaseConfig";
import MiniKeno from "../../../../_new-assets/games/mini-keno/view-models/MiniKeno";
import KenoUtils from "./KenoUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoPageIndicatorItem extends cc.Component {

    @property(cc.Sprite)
    dot: cc.Sprite = null;

    @property({ type: cc.SpriteFrame })
    dotFrames: cc.SpriteFrame[] = [];

    @property(cc.Label)
    gameName: cc.Label = null;

    private highlighted = false;
    private miniKeno: MiniKeno;
    private actionTag = 10000;

    init(miniKeno: MiniKeno) {
        this.miniKeno = miniKeno;
        this.gameName.string = KenoUtils.getKenoName(this.miniKeno.kenoType);
        this.gameName.node.active = false;
        this.updateImage();
    }

    onLoad() {
        this.updateImage();
        this.schedule(this.updateImage, 1);
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
    }

    eventOnEnter() {
        this.gameName.node.active = true;
    }

    eventOnLeave() {
        this.gameName.node.active = false;
    }

    public setHighlight(highlight: boolean) {
        this.highlighted = highlight;
        this.updateImage();
    }

    public updateImage() {
        const config = this.miniKeno.config;
        if (!this.highlighted) {
            if (this.miniKeno.currentTimeRemaining <= config.stopBetTime) {
                this.dot.spriteFrame = this.dotFrames[0];
                this.dot.node.color = cc.Color.RED;
                this.playEffect();
                return;
            }
            if (this.miniKeno.currentTimeRemaining > config.betTime && this.miniKeno.currentTimeRemaining <= config.fullTime) {
                this.dot.spriteFrame = this.dotFrames[0];
                this.dot.node.color = cc.Color.YELLOW;
                this.playEffect();
                return;
            }
        }

        this.stopEffect();
        this.dot.spriteFrame = this.highlighted ? this.dotFrames[0] : this.dotFrames[1];
        this.dot.node.color = cc.Color.WHITE;
    }

    playEffect() {
        const children = this.node.children;
        if (children.length < 1) {
            return;
        }
        const child = children[0];
        child.color = this.dot.node.color;

        if (child.getActionByTag(this.actionTag)) {
            return;
        }

        const spawn = cc.spawn(cc.scaleTo(1, 1), cc.fadeOut(1));
        const reset = cc.spawn(cc.scaleTo(0, 0.5), cc.fadeIn(0));
        const sequence = cc.sequence(spawn, cc.delayTime(0.1), reset);
        child.scale = 0.5;
        child.opacity = 255;
        child.stopAllActions();
        const action = cc.repeatForever(sequence);
        action.setTag(this.actionTag);
        child.runAction(action);
    }

    stopEffect() {
        const children = this.node.children;
        if (children.length < 1) {
            return;
        }
        children[0].stopActionByTag(this.actionTag);
        children[0].opacity = 0;
    }
}
