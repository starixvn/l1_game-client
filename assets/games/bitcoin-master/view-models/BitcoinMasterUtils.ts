export default class BitcoinMasterUtils {
    public static getEvenOddResult(value: number): string {
        const result = value.toString().split(".")[0];
        return result.substr(-1, 1);
    }

    public static getUpDownResult(result: any): string {
        const marginResult = result.close - result.open;
        return marginResult.toFixed(2);
    }

    public static absResult(result: number): string {
        return Math.abs(result).toString();
    }
}
