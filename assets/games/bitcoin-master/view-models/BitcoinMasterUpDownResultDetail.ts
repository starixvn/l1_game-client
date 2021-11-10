import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import BitcoinMasterGapAmount from "./BitcoinMasterGapAmount";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterUpDownResultDetail extends cc.Component {
    @property(cc.Label)
    result: cc.Label = null;

    @property(BitcoinMasterGapAmount)
    gapAmountComp: BitcoinMasterGapAmount = null;

    public setData(data: any) {
        this.result.string = `${numberWithCommas(data.close)} `;
        this.gapAmountComp.setData(data);
    }
}
