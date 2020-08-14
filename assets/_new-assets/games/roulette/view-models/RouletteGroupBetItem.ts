import CustomButton from "../../../common/custom-button/CustomButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteGroupBetItem extends CustomButton {
    @property
    betType: string = ""

    @property
    numbers: string = "";

    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Node)
    winning: cc.Node = null;

    private selectedNumbers: number[] = [];
    private originFrame: cc.SpriteFrame;

    public groupBetItemCallback = {
        highlight: (highlight: boolean, numbers: number[]) => { },
        selected: (betType: string, numbers: number[]) => { }
    }

    getNumbers(): number[] {
        return this.selectedNumbers;
    }

    onLoad() {
        super.onLoad();
        if (this.winning) {
            this.originFrame = this.winning.getComponent(cc.Sprite).spriteFrame;
        }

        this.selectedNumbers = this.numbers.split(',').map(i => +i);
        this.callback.highlight = (highlight) => {
            this.groupBetItemCallback.highlight(highlight, this.selectedNumbers);
            highlight ? this.showHighlight() : this.clearHighlight();
        };
        this.callback.selected = () => this.groupBetItemCallback.selected(this.betType, this.selectedNumbers);

        this.clearHighlight();
        this.hideWinning();
    }

    public clearHighlight() {
        if (this.highlight) {
            this.highlight.stopAllActions();
            this.highlight.runAction(cc.fadeOut(0.1));
        }
    }

    public showHighlight() {
        if (this.highlight) {
            this.highlight.stopAllActions();
            this.highlight.runAction(cc.fadeIn(0.11));
        }
    }

    public showWinning(animated: boolean) {
        this.winning && (this.winning.active = animated);
        const sprite = this.winning.getComponent(cc.Sprite);
        sprite.spriteFrame = this.originFrame;
        if (animated) {
            // sprite.spriteFrame = this.highlight.getComponent(cc.Sprite).spriteFrame;
            const sequence = cc.sequence(
                cc.fadeOut(.2),
                cc.fadeIn(.2),
            );
            this.winning.runAction(cc.sequence(
                cc.repeat(sequence, 10),
                cc.fadeOut(.2),
                cc.callFunc(() => {
                    sprite.spriteFrame = this.originFrame;
                })
            ));
        }
    }

    public hideWinning() {
        this.winning && (this.winning.active = false);
    }
}
