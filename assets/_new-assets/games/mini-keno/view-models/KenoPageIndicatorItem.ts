import { GameBaseConfigs } from "../../../../_new-assets/games/_base/GameBaseConfig";
import MiniKeno from "../../../../_new-assets/games/mini-keno/view-models/MiniKeno";
import KenoUtils from "./KenoUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoPageIndicatorItem extends cc.Component {

    @property(cc.Label)
    gameName: cc.Label = null;

    @property(cc.ProgressBar)
    proressBar: cc.ProgressBar = null;

    @property(cc.Node)
    effect: cc.Node = null;

    private highlighted = false;
    private miniKeno: MiniKeno;
    private actionTag = 10000;

    init(miniKeno: MiniKeno) {
        this.miniKeno = miniKeno;
        this.gameName.string = KenoUtils.getKenoName(this.miniKeno.kenoType);
        // this.gameName.node.active = false;
        this.updateImage();
    }

    onLoad() {
        this.node.active = false;
        this.schedule(this.updateImage, 1);
        // this.node.on(cc.Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        // this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
    }

    start() {
        this.updateImage();
    }

    onDestroy() {
        // this.node.off(cc.Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        // this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
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
        if (!this.miniKeno.currentTimeRemaining) {
            return;
        }
        this.node.active = true;

        const config = this.miniKeno.config;
        let progress = (config.betTime - this.miniKeno.currentTimeRemaining) / config.betTime;
        // progress = Math.max(progress, 0);
        progress = Math.min(progress, 1);
        this.proressBar.progress = progress < 0 ? 1 : progress;

        this.node.opacity = 255;
        if (!this.highlighted) {
            if (this.miniKeno.currentTimeRemaining <= config.stopBetTime) {
                this.setItemColor(cc.Color.RED);
                this.playEffect();
                return;
            }
            if (this.miniKeno.currentTimeRemaining > config.betTime && this.miniKeno.currentTimeRemaining <= config.fullTime) {
                this.setItemColor(cc.Color.YELLOW);
                this.playEffect();
                return;
            }
        }

        this.stopEffect();
        this.node.opacity = this.highlighted ? 255 : 102;
    }

    private setItemColor(color: cc.Color) {
        this.gameName.node.color = color;
        this.proressBar.node.color = color;
        this.proressBar.barSprite.node.color = color;
        this.effect.color = color;
    }

    playEffect() {
        const effect = this.effect;
        if (effect.getActionByTag(this.actionTag)) {
            return;
        }

        const spawn = cc.spawn(cc.scaleTo(1, 1.1, 2), cc.fadeOut(1));
        const reset = cc.spawn(cc.scaleTo(0, 1), cc.fadeIn(0));
        const sequence = cc.sequence(spawn, cc.delayTime(0.1), reset);
        effect.scale = 1;
        effect.opacity = 255;
        effect.stopAllActions();
        const action = cc.repeatForever(sequence);
        action.setTag(this.actionTag);
        effect.runAction(action);
    }

    stopEffect() {
        this.effect.stopActionByTag(this.actionTag);
        this.effect.scale = 1;
        this.effect.opacity = 0;
        this.setItemColor(cc.Color.WHITE);
    }
}
