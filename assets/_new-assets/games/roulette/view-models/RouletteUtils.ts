
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
}
