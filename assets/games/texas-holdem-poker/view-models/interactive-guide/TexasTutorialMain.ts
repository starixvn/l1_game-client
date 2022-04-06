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
    cancelButton: cc.Node = null;

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

    onLoad() {
        super.onLoad();
        this.md5Main.opacity = 0;
        this.menuMain.opacity = 0;
        this.setOpacityButtonNextPre(-1);
    }

    onClickNext() {
        const index = this.currentIndex + 1;
        if (index < this.items.length) {
            this.setOpacityButtonNextPre(index);
            this.dotSlideSprite[index].spriteFrame = this.dotSlideSpriteFrame[0];
            this.dotSlideSprite[index - 1].spriteFrame = this.dotSlideSpriteFrame[1];
        }
        super.onClickNext();
    }

    onClickPrevious() {
        const index = this.currentIndex - 1;
        if (index > -1) {
            this.setOpacityButtonNextPre(index);
            this.dotSlideSprite[index].spriteFrame = this.dotSlideSpriteFrame[0];
            this.dotSlideSprite[index + 1].spriteFrame = this.dotSlideSpriteFrame[1];
        }
        super.onClickPrevious();
    }

    setOpacityButtonNextPre(indexCurrent: number) {
        if (indexCurrent <= 0) {
            this.btnPrev.opacity = 50;
            return;
        }

        if (indexCurrent === this.items.length - 1) {
            this.btnNext.opacity = 50;
            return;
        }

        this.btnPrev.opacity = 255;
        this.btnNext.opacity = 255;
    }
}
