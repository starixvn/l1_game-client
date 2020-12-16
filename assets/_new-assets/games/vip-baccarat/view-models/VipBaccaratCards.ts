import NewCard from '../../../common/new-card/view-models/NewCard';
import BaccaratCard from '../../baccarat/view-models/BaccaratCard';
import BaccaratCards from '../../baccarat/view-models/BaccaratCards';

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipBaccaratCards extends BaccaratCards {
  protected resetCard(card: cc.Node) {
    card.children[0].getComponent(NewCard).faceDown();
    card.opacity = 0;
    card.scale = 0.5;
    card.angle = -135;
    card.y = 0;
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
          const currentX = this.card3.x;
          currentCard.runAction(
            cc.sequence(
              cc.delayTime(delayTime),
              cc.rotateBy(0.5, this.isBanker ? 270 : -270).easing(cc.easeSineOut()),
              cc.moveTo(0.5, cc.v2(currentX, -15)).easing(cc.easeSineOut())
            )
          );
        }
      } else {
        if (this.isMainPage && index == 2) {
          currentCard.opacity = 255;
          currentCard.scale = 1;
          currentCard.angle = this.isBanker ? 90 : -90;
          currentCard.y = -15;
        }
      }

      if (this.point) {
        const point: number = cardData.card + 1;
        const SET_PONT = 3;
        const setPoint = cc.sequence(
          cc.delayTime(delayTime),
          cc.callFunc(() => this.setPoint(point >= 10 ? 0 : point))
        );

        this.node.stopActionByTag(SET_PONT);
        setPoint.setTag(SET_PONT);
        currentCard.runAction(setPoint);
      }
    }
  }
}
