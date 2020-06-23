import { GameBaseConfigs } from "../../../../_new-assets/games/_base/GameBaseConfig";
import MiniKeno from "../../../../_new-assets/games/mini-keno/view-models/MiniKeno";
import KenoUtils, { KenoType } from "./KenoUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoPageIndicatorItem extends cc.Component {

    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Sprite)
    gameName: cc.Sprite = null;

    @property(cc.ProgressBar)
    proressBar: cc.ProgressBar = null;

    @property({ type: cc.SpriteFrame })
    backgroundFrames: cc.SpriteFrame[] = [];

    @property({ type: cc.SpriteFrame })
    nameFrames: cc.SpriteFrame[] = [];

    // @property(cc.Node)
    // effect: cc.Node = null;

    private highlighted = false;
    private miniKeno: MiniKeno;
    private actionTag = 10000;
    private currentTimeRemaining: number;
    private dataKey: string;

    init(miniKeno: MiniKeno) {
        this.miniKeno = miniKeno;
        this.gameName.spriteFrame = this.nameFrames[this.miniKeno.kenoType];
        const dict = {
            ProViet: 0,
            Max: 1,
            Max2: 1,
            Mini: 2,
            Mini2: 2,
            East: 3,
            West: 3,
            South: 3,
            North: 3,
        }
        const backSprite = this.backgroundFrames[dict[KenoType[this.miniKeno.kenoType]]];
        this.proressBar.barSprite.spriteFrame = backSprite;
        this.proressBar.getComponent(cc.Sprite).spriteFrame = backSprite;

        this.dataKey = `indicator_${this.miniKeno.gameName}`;
        this.updateImage();
    }

    onLoad() {
        this.node.active = false;
        cc.RedT.addDataObserver(this.dataKey, (data) => this.receivedData(data));
        // this.schedule(this.playtime, 1);

        // this.node.on(cc.Node.EventType.MOUSE_ENTER, this.eventOnEnter, this);
        // this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.eventOnLeave, this);
    }

    receivedData(data) {
        const dataGame = data[this.miniKeno.gameName];
        if (dataGame) {
            if (dataGame.um || dataGame.remainingTime) {
                this.currentTimeRemaining = dataGame.remainingTime || 0;
                this.playTime();
            }
        }
    }

    playTime() {
        this.updateTime();
        this.schedule(this.updateTime, 1);
    }

    updateTime() {
        this.currentTimeRemaining--;
        this.updateImage();
        if (this.currentTimeRemaining < 0) {
            this.unschedule(this.updateTime);
        }
    }

    onDestroy() {
        cc.RedT.removeDataObserver(this.dataKey);
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
        this.node.active = true;

        const config = this.miniKeno.config;
        let progress = (config.betTime - this.currentTimeRemaining) / config.betTime;
        // progress = Math.max(progress, 0);
        progress = Math.min(progress, 1);
        this.proressBar.progress = progress < 0 ? 1 : progress;
        this.highlight.active = this.highlighted;
    }
}
