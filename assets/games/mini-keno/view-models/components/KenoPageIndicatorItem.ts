import NoticeUtil from "../../../../common/utils/NoticeUtil";
import MiniKeno from "../../../../games/mini-keno/view-models/MiniKeno";
import { KenoType } from "../KenoUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoPageIndicatorItem extends cc.Component {
    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Sprite)
    gameName: cc.Sprite = null;

    @property(cc.ProgressBar)
    proressBar: cc.ProgressBar = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    private highlighted = false;
    public miniKeno: MiniKeno;
    private currentTimeRemaining: number;

    init(miniKeno: MiniKeno) {
        this.miniKeno = miniKeno;
        const kenoType = this.miniKeno.kenoType;
        this.gameName.spriteFrame = this.getNameSprite(kenoType);
        const dict = {
            Mega: "max",
            Mega2: "max",
            Mini: "mini",
            Mini2: "mini",
            East: "EWSN",
            West: "EWSN",
            South: "EWSN",
            North: "EWSN"
        };
        const backSprite = this.atlas.getSpriteFrame(`progress_bar_${dict[KenoType[kenoType]]}`);
        this.proressBar.barSprite.spriteFrame = backSprite;
        this.proressBar.getComponent(cc.Sprite).spriteFrame = backSprite;

        this.updateImage();
    }

    getNameSprite(type: KenoType) {
        const dict = {
            ProViet: "pro_viet",
            Mega: "mega",
            Mega2: "mega2",
            Mini: "mini",
            Mini2: "mini2",
            East: "east",
            West: "west",
            South: "south",
            North: "north"
        };
        const name = `progress_${dict[KenoType[type]]}_text`;
        const suffix = NoticeUtil.getCurrentLanguage() !== "vi" ? "_en" : "";
        const sprite = this.atlas.getSpriteFrame(`${name}${suffix}`);
        return sprite ? sprite : this.atlas.getSpriteFrame(name);
    }

    onLoad() {
        this.node.active = false;
    }

    stop() {
        this.unschedule(this.updateTime);
        this.proressBar.progress = 1;
    }

    setData(data) {
        if (data.um) {
            this.currentTimeRemaining = this.miniKeno.config.betTime;
            this.unschedule(this.updateTime);
            this.updateImage();
        } else if (data.remainingTime) {
            this.currentTimeRemaining = data.remainingTime - 1;
            this.unschedule(this.updateTime);
            this.playTime();
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
        progress = Math.min(progress, 1);
        this.proressBar.progress = progress < 0 ? 1 : progress;
        this.highlight.active = this.highlighted;
    }
}
