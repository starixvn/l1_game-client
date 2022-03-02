import HoldemPokerHandPlace from "../../../holdem-poker/components/cards/view-models/HoldemPokerHandPlace";
import { CardAnimation } from "../../type";
import { CardModel } from "../../../../common/new-card/view-models/NewCard";
import HoldemPokerCard from "../../../holdem-poker/components/cards/view-models/HoldemPokerCard";
import HoldemPokerCards from "../../../holdem-poker/components/cards/view-models/HoldemPokerCards";

const { ccclass } = cc._decorator;
@ccclass
export default class TexasHoldemPokerCards extends HoldemPokerCards {
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
        if (!selectedCard) return;
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

    public showIndicatorSymbolOfCards(combineCard: CardModel[], whose: string) {
        switch (whose) {
            case "player":
                this.showIndicatorCard(combineCard, [
                    { row: this.playerCards, position: "top", whose: "player" },
                    { row: this.middleCards, position: "bot", whose: "player" }
                ]);
                break;
            case "dealer":
                this.showIndicatorCard(combineCard, [
                    { row: this.dealerCards, position: "top", whose: "dealer" },
                    { row: this.middleCards, position: "top", whose: "dealer" }
                ]);
                break;
            default:
                break;
        }
    }
}
