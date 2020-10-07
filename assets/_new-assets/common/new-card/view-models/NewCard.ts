
const { ccclass, property } = cc._decorator;

export interface CardModel {
    rank: string;
    suit: number;
}

export enum CardAnimation {
    // DealerToHand = "dealer_to_player",
    DealerToHand = "chia-bai",
    DropCard = "thu-bai",
    DealerCheckBlackJackFail = "dealer_check_blackjack_fail",
    DealerCheckBlackJackSuccess = "dealer_check_blackjack_success",
    DealerOpenCard = "dealer_open_card",
    DealerDrawingFaceDown = "dealer_drawing_face_down",
    PullCard = "pull_card",
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

    faceUp() {
        this.setFaceUp(true);
    }

    faceDown() {
        this.setFaceUp(false);
    }

    private showCardBack() {
        this.image.spriteFrame = this.atlas.getSpriteFrame("BACK_1");
    }

    playAnimation(type: CardAnimation, duration: number) {
        const state = this.animation.playAdditive(type);
        state.speed = state.duration / duration;
    }
}
