import CascadingSlotTumbleList from "./CascadingSlotTumbleList";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardCascadingSlotTumbleList extends CascadingSlotTumbleList {
    HEIGHT_CONTENT_REAL_MODE = 220;
    HEIGHT_CONTENT_TRIAL_MODE = 180;
    @property(cc.Node)
    maskNode: cc.Node = null;

    @property(cc.SpriteAtlas)
    mainAtlas: cc.SpriteAtlas = null;

    setHeightContent(isTrialMode: boolean) {
        const scrollViewNode = this.scrollView.node;
        const mask = this.maskNode.getComponent(cc.Mask);
        if (isTrialMode) {
            scrollViewNode.height = this.HEIGHT_CONTENT_TRIAL_MODE;
            mask.spriteFrame = this.mainAtlas.getSpriteFrame("tumble-win-mask-trial");
        } else {
            scrollViewNode.height = this.HEIGHT_CONTENT_REAL_MODE;
            mask.spriteFrame = this.mainAtlas.getSpriteFrame("tumble-win-mask-real");
        }
    }
}
