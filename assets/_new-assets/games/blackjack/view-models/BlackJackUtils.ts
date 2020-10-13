
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
}