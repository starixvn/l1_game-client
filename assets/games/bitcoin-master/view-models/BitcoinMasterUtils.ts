import { numberWithCommas } from "../../../common/helpers/NumberHelper";

export default class BitcoinMasterUtils {
    public static getEvenOddResult(value: number): string {
        const result = value.toString().split(".")[0];
        return result.substr(-1, 1);
    }

    public static getUpDownResult(result: any): string {
        const marginResult = result.close - result.open;
        return this.formattingBitcoinValue(marginResult);
    }

    public static absResult(result: number): string {
        return numberWithCommas(Math.abs(result).toFixed(2), 2, false);
    }

    public static formattingBitcoinValue(result: number): string {
        return numberWithCommas(result.toFixed(2), 2, false);
    }
}
