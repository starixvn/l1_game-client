
const { ccclass, property } = cc._decorator;

export interface CardModel {
    rank: string;
    suit: number;
}

@ccclass
export default class NewCard extends cc.Component {
    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    image: cc.Sprite = null;

    @property(cc.Animation)
    animation: cc.Animation = null;

    private card: CardModel = { rank: "A", suit: 3 };

    public onAnimationComplete = () => { }

    onLoad() {
        this.animation.on('finished', () => {
            this.onAnimationComplete();
        }, this);
    }

    setCard(card: CardModel) {
        this.card = card;
    }

    setFaceUp(faceUp: boolean) {
        if (faceUp) {
            if (this.card) {
                const suffix = ["A", "B", "C", "D"];
                this.image.spriteFrame = this.atlas.getSpriteFrame(`${this.card.rank}${suffix[this.card.suit]}`);
            } else {
                console.warn("Call setFaceUp when this.card null");
                this.showCardBack();
            }
        } else {
            this.showCardBack();
        }
    }

    private showCardBack() {
        this.image.spriteFrame = this.atlas.getSpriteFrame("BACK_1");
    }
}
