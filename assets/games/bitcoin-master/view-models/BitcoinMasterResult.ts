import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import BitcoinMasterGapAmount from "./BitcoinMasterGapAmount";
import BitcoinMasterUtils from "./BitcoinMasterUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterResult extends cc.Component {
    @property(BitcoinMasterGapAmount)
    gapAmountComp: BitcoinMasterGapAmount = null;

    @property(cc.Label)
    evenOddResultLabel: cc.Label = null;

    @property(cc.Label)
    closeBitcoinLabel: cc.Label = null;

    showResult(show = true) {
        this.closeBitcoinLabel.node.active = show;
        this.gapAmountComp.gapAmount.node.active = show;
        this.evenOddResultLabel.node.active = show;
    }

    setData(data: any) {
        this.closeBitcoinLabel.string = numberWithCommas(data.close);
        this.gapAmountComp.setData(data);
        this.gapAmountComp.icon.node.position = this.gapAmountComp.isUpResult
            ? cc.v3(this.gapAmountComp.icon.node.position.x, this.gapAmountComp.icon.node.position.y, 0)
            : cc.v3(this.gapAmountComp.icon.node.position.x, -this.gapAmountComp.icon.node.position.y, 0);

        const evenOddValue = BitcoinMasterUtils.getEvenOddResult(data.close);
        this.evenOddResultLabel.string = evenOddValue;
        const color = cc.Color.WHITE;
        this.evenOddResultLabel.node.color = parseFloat(evenOddValue) % 2 ? color.fromHEX("#f3485f") : color.fromHEX("#bac5ca");
    }
}
