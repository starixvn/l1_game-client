import BaccaratCards from "../../baccarat/view-models/BaccaratCards";

const { ccclass } = cc._decorator;

@ccclass
export default class VipBaccaratCards extends BaccaratCards {
    protected resetCard(card: cc.Node) {
        super.resetCard(card);
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
