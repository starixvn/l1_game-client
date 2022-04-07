import NewCard from "../../../../common/new-card/view-models/NewCard";
import TutorialMain from "../../../../common/tutorial/TutorialMain";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TexasTurorialMain extends TutorialMain {
    @property({ type: NewCard })
    dealerCards: NewCard[] = [];

    @property({ type: NewCard })
    playerCards: NewCard[] = [];

    @property(cc.Node)
    swapButton: cc.Node = null;

    @property(cc.Node)
    holdButton: cc.Node = null;

    @property(cc.Node)
    callButton: cc.Node = null;

    @property(cc.Node)
    foldButton: cc.Node = null;

    @property(cc.Sprite)
    dotSlideSprite: cc.Sprite[] = [];

    @property(cc.SpriteFrame)
    dotSlideSpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.Node)
    btnNext: cc.Node = null;

    @property(cc.Node)
    btnPrev: cc.Node = null;

    @property(cc.Node)
    md5Node: cc.Node = null;

    @property(cc.Node)
    md5Main: cc.Node = null;

    @property(cc.Node)
    menuMain: cc.Node = null;

    @property(cc.SpriteFrame)
    nextPreSpriteFrame: cc.SpriteFrame[] = [];

    onLoad() {
        super.onLoad();
        this.md5Main.opacity = 0;
        this.menuMain.opacity = 0;
        this.setStatusButtonNextPre(0);
    }

    onClickNext() {
        super.onClickNext();
        this.setStatusButtonNextPre(this.currentIndex);
        this.dotSlideSprite[this.currentIndex].spriteFrame = this.dotSlideSpriteFrame[0];
        this.dotSlideSprite[this.currentIndex - 1].spriteFrame = this.dotSlideSpriteFrame[1];
    }

    onClickPrevious() {
        super.onClickPrevious();
        this.setStatusButtonNextPre(this.currentIndex);
        this.dotSlideSprite[this.currentIndex].spriteFrame = this.dotSlideSpriteFrame[0];
        this.dotSlideSprite[this.currentIndex + 1].spriteFrame = this.dotSlideSpriteFrame[1];
    }

    setStatusButtonNextPre(indexCurrent: number) {
        if (indexCurrent === 0) {
            this.btnPrev.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.nextPreSpriteFrame[0];
            this.btnPrev.getComponent(cc.Button).enabled = false;
            return;
        }

        if (indexCurrent > 2) {
            this.btnNext.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.nextPreSpriteFrame[0];
            this.btnNext.getComponent(cc.Button).enabled = false;
            return;
        }
        this.btnPrev.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.nextPreSpriteFrame[1];
        this.btnNext.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.nextPreSpriteFrame[1];
        this.btnPrev.getComponent(cc.Button).enabled = true;
        this.btnNext.getComponent(cc.Button).enabled = true;
    }
}
