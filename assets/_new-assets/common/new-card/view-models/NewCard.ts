
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

    @property(cc.Node)
    description: cc.Node = null;

    @property(cc.Sprite)
    number: cc.Sprite = null;

    @property(cc.Sprite)
    smallSuite: cc.Sprite = null;

    @property(cc.Sprite)
    largeSuite: cc.Sprite = null;


    private card: CardModel = { rank: "A", suit: 3 };

    private suffix = ["heart", "diamond", "club", "spade"];
    private picture = {
        "j": "j_picture",
        "q": "q_picture",
        "k": "k_picture"
    };


    public onAnimationComplete = () => { }

    onLoad() {
        this.animation && this.animation.on('finished', () => {
            this.onAnimationComplete();
        }, this);
    }

    setCard(card: CardModel) {
        this.card = card;
    }

    setFaceUp(faceUp: boolean) {
        if (faceUp) {
            if (this.card) {
                this.description.active = true;

                const lowerCaseRank = this.card.rank.toLowerCase();
                const color = cc.Color.BLACK;
                this.number.spriteFrame = this.atlas.getSpriteFrame(lowerCaseRank);
                this.number.node.color = this.card.suit > 1 ? color : color.fromHEX("#960000");
                this.smallSuite.spriteFrame = this.atlas.getSpriteFrame(`${this.suffix[this.card.suit]}_small`);

                if (+this.card.rank || this.card.rank == "A") {
                    this.largeSuite.spriteFrame = this.atlas.getSpriteFrame(this.suffix[this.card.suit]);
                } else {
                    this.largeSuite.spriteFrame = this.atlas.getSpriteFrame(this.picture[lowerCaseRank]);
                }

                this.image.spriteFrame = this.atlas.getSpriteFrame("card_bg");
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
        this.description.active = false;
        this.image.spriteFrame = this.atlas.getSpriteFrame("BACK_1");
    }

    playAnimation(type: CardAnimation, duration: number) {
        const state = this.animation.playAdditive(type);
        state.speed = state.duration / duration;
    }
}
