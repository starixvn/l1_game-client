import HoldemPokerHandPlace from "../../../holdem-poker/components/cards/view-models/HoldemPokerHandPlace";
import { CardAnimation } from "../../texas-type";
import { CardModel } from "../../../../common/new-card/view-models/NewCard";
import HoldemPokerCard from "../../../holdem-poker/components/cards/view-models/HoldemPokerCard";
import HoldemPokerCards from "../../../holdem-poker/components/cards/view-models/HoldemPokerCards";

const { ccclass } = cc._decorator;
@ccclass
export default class TexasCards extends HoldemPokerCards {
    protected createCard(card: CardModel, scaleX: number, scaleY: number): cc.Node {
        const node = cc.instantiate(this.cardPrefab);
        const cardComponent = node.getComponent(HoldemPokerCard);
        cardComponent.setCardOldStyle(card);
        node.scaleX = scaleX;
        node.scaleY = scaleY;
        return node;
    }

    protected faceUpCard(cardInfo: CardModel, cardHand: HoldemPokerHandPlace, indexCard: number): Promise<void> {
        const selectedCard = cardHand.getCards()[indexCard];
        if (!selectedCard) {
            return null;
        }
        const duration = 0.6;
        const cardComponent = selectedCard.getComponent(HoldemPokerCard);

        return new Promise((resolve) => {
            cc.tween(selectedCard)
                .call(() => {
                    cardComponent.setCardOldStyle(cardInfo);
                    cardComponent.playAnimation(CardAnimation.DealerOpenCard, duration);
                })
                .delay(duration)
                .call(() => resolve())
                .start();
        });
    }
}
