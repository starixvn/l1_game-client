import AudioManager from "../../../common/audio/AudioManager";
import { getRandomCard } from "../../../common/helpers/CardHelper";
import { CardModel } from "../../../common/new-card/view-models/NewCard";
import HiLoCard from "../components/view-models/HiLoCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoResult extends cc.Component {
    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    cardReel: cc.Node = null;

    @property(cc.AudioClip)
    spinAudioClip: cc.AudioClip = null;

    @property(cc.AudioClip)
    spinStopAudioClip: cc.AudioClip = null;

    protected readonly cardCount = 16;
    private readonly cardList: HiLoCard[] = [];
    private readonly cardWidth = 118;
    private readonly cardHeight = 150;
    private readonly cardScaleX = 1.23;
    private readonly cardScaleY = 1.5;
    private readonly cardScaleZ = 1.23;
    private readonly cardModels: CardModel[] = [];
    private topCard: HiLoCard;
    private bottomCard: HiLoCard;
    private spinAudioId: number;

    onLoad() {
        this.initCardModels();
        this.createReel();
    }

    initCardModels() {
        for (let i = 0; i < this.cardCount; i++) {
            this.cardModels.push(getRandomCard());
        }
    }

    createReel() {
        this.cardReel && this.cardReel.destroyAllChildren();
        for (const card of this.cardModels) {
            const cardNode = this.createCard();
            this.cardReel.addChild(cardNode);
            const cardComp = cardNode.getComponent(HiLoCard);
            cardComp.faceDown();
            this.setCard(cardComp, card);
            this.cardList.push(cardComp);
        }
        this.cardReel.getComponent(cc.Layout).updateLayout();
        this.topCard = this.cardList[this.cardList.length - 1];
        this.bottomCard = this.cardList[0];
    }

    createCard(): cc.Node {
        const node = cc.instantiate(this.cardPrefab);
        node.width = this.cardWidth;
        node.height = this.cardHeight;
        node.scaleX = this.cardScaleX;
        node.scaleY = this.cardScaleY;
        node.scaleZ = this.cardScaleZ;
        return node;
    }

    updateResult(result: CardModel[]) {
        if (result.length === 0) {
            return;
        }
        this.setCard(this.topCard, result[result.length - 1]);
    }

    setCard(cardComponent: HiLoCard, data: CardModel) {
        cardComponent.setCard(data);
        cardComponent.faceUp();
    }

    faceDownCards() {
        this.cardList.forEach((card) => {
            card.faceDown();
        });
    }

    playSpinAudio() {
        this.spinAudioId = AudioManager.getInstance().playSFX(this.spinAudioClip);
    }

    playSpinStopAudio() {
        AudioManager.getInstance().playSFX(this.spinStopAudioClip);
    }

    stopSpinAudio() {
        AudioManager.getInstance().stopSFX(this.spinAudioId);
    }

    spin(spinDuration: number, animated: boolean) {
        this.cardList.forEach((card) => {
            if (card !== this.bottomCard) {
                card.faceUp();
            }

            if (card !== this.topCard && card !== this.bottomCard) {
                this.setCard(card, getRandomCard());
            }
        });

        const offset = this.cardReel.height - this.cardHeight * this.cardScaleY;
        if (animated) {
            this.cardReel.position = cc.v3(0, 0, 0);
            this.cardReel.stopAllActions();
            this.playSpinAudio();
            cc.tween(this.cardReel)
                .to(spinDuration, { position: cc.v3(0, -offset, 0) }, { easing: "sineInOut" })
                .call(() => {
                    this.stopSpinAudio();
                    this.syncBottomCard();
                    this.playSpinStopAudio();
                })
                .start();
        } else {
            this.cardReel.position = cc.v3(0, -offset, 0);
            this.syncBottomCard();
        }
    }

    syncBottomCard() {
        this.setCard(this.bottomCard, this.topCard.card);
        this.bottomCard.faceUp();
    }
}
