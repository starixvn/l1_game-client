import { CardAnimation } from "../../event-models/texas-holdem-poker-constant";

const { ccclass, property } = cc._decorator;

export interface CardModel {
  rank: number | string;
  suit: number | string;
}

@ccclass
export default class TexasHoldemPokerCard extends cc.Component {
  @property(cc.SpriteAtlas)
  atlas: cc.SpriteAtlas = null;

  @property(cc.SpriteAtlas)
  miniCardAtlas: cc.SpriteAtlas = null;

  @property(cc.Animation)
  animation: cc.Animation = null;

  @property(cc.Sprite)
  image: cc.Sprite = null;

  @property(cc.SpriteFrame)
  card1: cc.SpriteFrame[] = [null, null, null, null];

  @property(cc.SpriteFrame)
  card2: cc.SpriteFrame[] = [null, null, null, null];

  @property(cc.SpriteFrame)
  card3: cc.SpriteFrame[] = [null, null, null, null];

  @property(cc.SpriteFrame)
  card4: cc.SpriteFrame[] = [null, null, null, null];

  @property(cc.SpriteFrame)
  card5: cc.SpriteFrame[] = [null, null, null, null];

  @property(cc.SpriteFrame)
  card6: cc.SpriteFrame[] = [null, null, null, null];

  @property(cc.SpriteFrame)
  card7: cc.SpriteFrame[] = [null, null, null, null];

  @property(cc.SpriteFrame)
  card8: cc.SpriteFrame[] = [null, null, null, null];

  @property(cc.SpriteFrame)
  card9: cc.SpriteFrame[] = [null, null, null, null];

  @property(cc.SpriteFrame)
  card10: cc.SpriteFrame[] = [null, null, null, null];

  @property(cc.SpriteFrame)
  card11: cc.SpriteFrame[] = [null, null, null, null];

  @property(cc.SpriteFrame)
  card12: cc.SpriteFrame[] = [null, null, null, null];

  @property(cc.SpriteFrame)
  card13: cc.SpriteFrame[] = [null, null, null, null];

  private card: CardModel = { rank: 0, suit: 3 };
  private defaultSizeBgW: number = null;
  private defaultSizeBgH: number = null;

  public onAnimationComplete = () => {};

  onLoad() {
    this.animation &&
      this.animation.on(
        "finished",
        () => {
          this.onAnimationComplete();
        },
        this
      );

    this.defaultSizeBgW = this.image.node.width;
    this.defaultSizeBgH = this.image.node.height;
  }

  setCard(card: CardModel) {
    this.card = card;
  }

  getCard() {
    return this.card;
  }

  getCardFrame() {
    switch (this.card.rank) {
      case 0:
        return this.card1[this.card.suit];
      case 1:
        return this.card2[this.card.suit];
      case 2:
        return this.card3[this.card.suit];
      case 3:
        return this.card4[this.card.suit];
      case 4:
        return this.card5[this.card.suit];
      case 5:
        return this.card6[this.card.suit];
      case 6:
        return this.card7[this.card.suit];
      case 7:
        return this.card8[this.card.suit];
      case 8:
        return this.card9[this.card.suit];
      case 9:
        return this.card10[this.card.suit];
      case 10:
        return this.card11[this.card.suit];
      case 11:
        return this.card12[this.card.suit];
      case 12:
        return this.card13[this.card.suit];
    }
  }

  setFaceUp(faceUp: boolean) {
    if (faceUp) {
      if (this.card) {
        this.image.spriteFrame = this.getCardFrame();
      } else {
        console.warn("Call setFaceUp when this.card null");
        this.showCardBack();
      }
    } else {
      this.showCardBack();
    }
  }

  setCardHistory(faceUp: boolean) {
    if (faceUp) {
      if (this.card) {
        const cardName = this.card.rank.toString() + this.card.suit;
        this.image.spriteFrame = this.miniCardAtlas.getSpriteFrame(cardName);
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

  playAnimation(type: CardAnimation, duration: number) {
    const state = this.animation.playAdditive(type);
    state.speed = state.duration / duration;
  }

  faceUp() {
    this.setFaceUp(true);
  }

  faceDown() {
    this.setFaceUp(false);
  }
}
