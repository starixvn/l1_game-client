import { RouletteBetInfo, RouletteBetType } from "./Roulette";

export default class RouletteUtils {
    private static redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    public static isRed(number): boolean {
        return this.redNumbers.indexOf(number) != -1;
    }

    public static isOdd(number): boolean {
        return number % 2 != 0;
    }

    public static isBig(number): boolean {
        return number > 18;
    }

    public static getKey(betInfo: RouletteBetInfo): string {
        let key = betInfo.numbers.join('-');
        switch (betInfo.type) {
            case RouletteBetType.Column:
                key = betInfo.numbers[0].toString();
                break;
            case RouletteBetType.Dozen:
                key = (Math.floor(betInfo.numbers[11] / 10)).toString();
                break;
            case RouletteBetType.EvenOdd:
                key = RouletteUtils.isOdd(betInfo.numbers[0]) ? "odd" : "even";
                break;
            case RouletteBetType.RedBlack:
                key = RouletteUtils.isRed(betInfo.numbers[0]) ? "red" : "black";
                break;
            case RouletteBetType.BigSmall:
                key = RouletteUtils.isBig(betInfo.numbers[0]) ? "big" : "small";
                break;
            default:
                break;
        }

        return key;
    }

    public static parseKeyToNumbers(key: string): number[] {
        return key.split('-').map(i => +i);
    }
}
