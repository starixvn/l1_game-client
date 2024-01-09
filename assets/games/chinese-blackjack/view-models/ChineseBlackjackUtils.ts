import { CardModel } from "../../../common/new-card/view-models/NewCard";

export default class ChineseBlackjackUtils {
    public static isBanLuck(cards: CardModel[]): boolean {
        if (cards.length !== 2) {
            return false;
        }

        const [card1, card2] = cards;
        const valueCheck = ["10", "J", "Q", "K"];

        return (valueCheck.includes(card1.rank) && card2.rank === "A") || (valueCheck.includes(card2.rank) && card1.rank === "A");
    }

    public static isBanBan(cards: CardModel[]): boolean {
        return cards.length === 2 && cards.every((card) => card.rank === "A");
    }
}
