
export default class BlackJackUtils {
    public static getValues(rank: string): number[] {
        switch (rank) {
            case "A":
                return [1, 11];
            case "J":
            case "Q":
            case "K":
                return [10];
            default:
                return [+rank];
        }
    }

    public static getTotal(cards: any[], cardNum: number): number[] {
        let total = 0;
        let hasAce = false;
        cards.forEach((card, index) => {
            if (index >= cardNum) {
                return;
            }
            if (card.rank === "A") {
                hasAce = true;
            }
            total += BlackJackUtils.getValues(card.rank)[0];
        });
        if (hasAce && total + 10 < 22) {
            return [total, total + 10];
        }
        return [total];
    }
}