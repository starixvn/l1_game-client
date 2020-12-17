import NewCard from '../../../common/new-card/view-models/NewCard';
import BaccaratCard from './BaccaratCard';

const { ccclass, property } = cc._decorator;
@ccclass
export default class BaccaratCards extends cc.Component {
  @property(cc.Node)
  card1: cc.Node = null;

  @property(cc.Node)
  card2: cc.Node = null;

  @property(cc.Node)
  card3: cc.Node = null;

  @property(cc.Sprite)
  cardBack: cc.Sprite = null;

  @property(cc.Node)
  otherCard: cc.Node = null;

  @property
  flyX: number = 0;

  @property
  isBanker: boolean = false;

  @property(cc.Node)
  cardsBox: cc.Node = null;

  @property(cc.Label)
  point: cc.Label = null;

  protected playGetCardAudio = () => {};
  protected readonly flyCardSecond = 0.8;
  protected readonly openCardSecond = 0.3;
  protected readonly openSecondCardSecond = 1.6;
  protected readonly setPointSecond = 0.2;
  protected isMainPage = false;

  private SHOW_CARD = 1;
  private SHOW_FINISH_CARD = 2;
  protected SET_POINT = 3;

  onLoad() {
    this.card1.children[0].getComponent(NewCard).faceDown();
    this.card2.children[0].getComponent(NewCard).faceDown();
    this.card3.children[0].getComponent(NewCard).faceDown();
  }

  init(playAudio, isMainPage = true) {
    playAudio && (this.playGetCardAudio = playAudio);
    isMainPage && this.resetCard(this.card3);
    this.isMainPage = isMainPage;
  }

  resetCards() {
    this.point.node.parent.active = false;
    this.point.string = '0';
    this.resetCard(this.card1);
    this.resetCard(this.card2);
    this.resetCard(this.card3);
    this.card3.active = false;
    this.showHighlightCards(false);
  }

  showHighlightCards(highlight: boolean = true) {
    for (let i = 1; i <= 3; i++) {
      const card = this['card' + i];
      const baccaratCard = card.getComponent(BaccaratCard);
      highlight ? baccaratCard.setHighlight() : baccaratCard.resetHighlight();
    }
  }

  showCardsWithoutAnimation(cards: any[]) {
    this.resetSomeActionCards();
    this.openCard(0, cards, false);
    this.openCard(1, cards, false);
    if (cards.length > 2 && cards[2]) {
      this.openCard(2, cards, false);
      this.otherCard && (this.otherCard.active = true);
    } else {
      this.otherCard && (this.otherCard.active = false);
    }
  }

  showCards(cards: any[], onFinishShowCards: () => void, playerHasCard3: boolean = false): void {
    this.point.string = '0';
    this.resetCard(this.card3);
    let delayTime = 0;
    const hasCard3 = cards.length == 3;
    const handleCard = cc.sequence(
      cc.callFunc(() => {
        this.openCard(0, cards);
      }),
      cc.delayTime(this.openCardSecond), // Waiting for open 1st card
      cc.callFunc(() => {
        this.openCard2(cards);
      }),
      cc.delayTime(this.openSecondCardSecond), // Waiting for open 2nd card
      cc.callFunc(() => {
        delayTime = this.openSecondCardSecond; // Waiting for the other side open 2nd card
        if (hasCard3) {
          delayTime = this.flyAndOpenCard3(cards, delayTime, playerHasCard3);
        }
        const handleFinishCard = cc.sequence(
          cc.delayTime(delayTime),
          cc.callFunc(() => onFinishShowCards && onFinishShowCards())
        );

        handleFinishCard.setTag(this.SHOW_FINISH_CARD);
        this.node.runAction(handleFinishCard);
      })
    );

    this.resetSomeActionCards();
    handleCard.setTag(this.SHOW_CARD);

    this.node.runAction(handleCard);
  }

  protected resetSomeActionCards() {
    this.node.stopActionByTag(this.SHOW_CARD);
    this.node.stopActionByTag(this.SHOW_FINISH_CARD);
    this.card1.stopActionByTag(this.SET_POINT);
    this.card2.stopActionByTag(this.SET_POINT);
    this.card3.stopActionByTag(this.SET_POINT);
  }

  flyFirstCard() {
    this.flyCard(this.card1);
  }

  flySecondCard() {
    this.flyCard(this.card2);
  }

  protected setPoint(point: number) {
    this.point.node.active = true;
    this.point.node.parent.active = true;

    const currentPoint = parseInt(this.point.string);
    this.point.node.parent.runAction(cc.sequence(cc.scaleTo(this.setPointSecond, 1.1, 1.1), cc.scaleTo(this.setPointSecond, 1, 1)));

    this.point.string = ((currentPoint + point) % 10).toString();
  }

  private openCard2(cards: any[]) {
    if (this.isBanker) {
      this.node.runAction(
        cc.sequence(
          cc.delayTime(this.openSecondCardSecond), // Waiting for player open 2nd card
          cc.callFunc(() => {
            this.openCard(1, cards);
          })
        )
      );
    } else {
      this.openCard(1, cards);
    }
  }

  private flyAndOpenCard3(cards: any[], delayTime: number, playerHasCard3: boolean) {
    let card = this.card3;
    card.active = true;

    if (this.isBanker) {
      if (playerHasCard3) {
        delayTime += this.flyCardSecond + this.openSecondCardSecond; // Waiting for player open 3rd card
      }

      this.node.runAction(
        cc.sequence(
          cc.delayTime(delayTime),
          cc.callFunc(() => this.flyCard(card, 0))
        )
      );
    } else {
      this.node.runAction(
        cc.sequence(
          cc.delayTime(delayTime),
          cc.callFunc(() => this.flyCard(card, 0))
        )
      );
    }

    delayTime += this.flyCardSecond;
    delayTime += 0.2; // Buffer time after the flight

    this.node.runAction(
      cc.sequence(
        cc.delayTime(delayTime),
        cc.callFunc(() => {
          this.openCard(2, cards);
        })
      )
    );

    delayTime += this.openSecondCardSecond;

    return delayTime;
  }

  private flyCard(card: cc.Node, angle: number = 0) {
    const cardPosition = card.position;
    card.position = this.cardsBox.position;
    card.opacity = 255;

    card.runAction(
      cc.spawn(
        cc.rotateTo(this.flyCardSecond, angle).easing(cc.easeInOut(2)),
        cc.scaleTo(this.flyCardSecond, 1).easing(cc.easeInOut(2)),
        cc.moveTo(this.flyCardSecond, cardPosition).easing(cc.easeInOut(2))
      )
    );

    cc.RedT.isSoundGame() &&
      card.runAction(
        cc.sequence(
          cc.delayTime(0.2),
          cc.callFunc(() => this.playGetCardAudio())
        )
      );
  }

  protected resetCard(card: cc.Node) {
    card.children[0].getComponent(NewCard).faceDown();
    card.opacity = 0;
    card.scale = 0.5;
    card.angle = -135;
  }

  protected openCard(index: number, cards: any[], isAnimated = true) {
    if (index < cards.length) {
      let delayTime = 0;
      const cardData = cards[index];
      const currentCard = this['card' + (index + 1)] as cc.Node;

      if (cardData) {
        currentCard.active = true;
      } else {
        currentCard.active = false;
      }

      const newCard = currentCard.children[0].getComponent(NewCard);
      newCard.setCardOldStyle({
        rank: cardData.card,
        suit: cardData.type,
      });
      newCard.faceUp();

      if (isAnimated) {
        if (index == 0) {
          // 1st card
          currentCard.scaleX = 0;
          currentCard.runAction(cc.scaleTo(this.openCardSecond, 1, 1));
          delayTime += this.openCardSecond;
        } else {
          this.cardBack.node.active = true;
          const position = cc.v2(currentCard.position.x - currentCard.width / 2, currentCard.position.y - currentCard.height / 2);
          this.cardBack.node.position = position;

          this.cardBack.node.runAction(
            cc.sequence(
              cc.moveBy(0.8, cc.v2(10, -10)).easing(cc.easeSineOut()),
              cc.spawn(
                cc.moveBy(0.8, cc.v2(150, -150)).easing(cc.easeExponentialInOut()),
                cc.fadeOut(0.8).easing(cc.easeExponentialInOut())
              ),
              cc.callFunc(() => {
                this.cardBack.node.active = false;
                this.cardBack.node.opacity = 255;
              })
            )
          );

          delayTime += this.openSecondCardSecond;
        }

        if (index == 2) {
          // 3rd card
          currentCard.runAction(
            cc.sequence(cc.delayTime(delayTime), cc.rotateBy(0.5, this.isBanker ? 270 : -270).easing(cc.easeSineOut()))
          );
        }
      } else {
        if (this.isMainPage && index == 2) {
          currentCard.opacity = 255;
          currentCard.scale = 1;
          currentCard.angle = this.isBanker ? 90 : -90;
        }
      }

      if (this.point) {
        const pointValue: number = cardData.card + 1;
        const setPoint = cc.sequence(
          cc.delayTime(delayTime),
          cc.callFunc(() => this.setPoint(pointValue >= 10 ? 0 : pointValue))
        );

        currentCard.stopActionByTag(this.SET_POINT);
        setPoint.setTag(this.SET_POINT);
        currentCard.runAction(setPoint);
      }
    }
  }
}
