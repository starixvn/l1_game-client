import NoticeUtil from "../utils/NoticeUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalizedMask extends cc.Mask {
    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property()
    prefix = "";

    onLoad() {
        this.spriteFrame = this.getSpriteFrameByLang(NoticeUtil.getCurrentLanguage());
    }

    getSpriteFrameByLang(lang: string) {
        const spriteName = `${this.prefix}_${lang}`;
        return this.atlas.getSpriteFrame(spriteName);
    }
}
