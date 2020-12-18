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

  protected setActionCardThree(currentCard: cc.Node, delayTime: number) {
    const currentX = this.card3.x;
    currentCard.runAction(
      cc.sequence(
        cc.delayTime(delayTime),
        cc.rotateBy(0.5, this.isBanker ? 270 : -270).easing(cc.easeSineOut()),
        cc.moveTo(0.5, cc.v2(currentX, -15)).easing(cc.easeSineOut())
      )
    );
  }
}
