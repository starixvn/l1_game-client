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

    @property(cc.Node)
    upIconPos: cc.Node = null;

    @property(cc.Node)
    downIconPos: cc.Node = null;

    @property(cc.Node)
    currentCandleValue: cc.Node = null;

    @property(cc.Node)
    line: cc.Node = null;

    private movingClosePriceFromPos: cc.Vec3;
    private closePricePos: cc.Vec3;
    private movingGapAmountFromPos: cc.Vec3;
    private gapAmountPos: cc.Vec3;
    private movingEvenOddResultFromPos: cc.Vec3;
    private evenOddResultPos: cc.Vec3;

    onLoad() {
        this.line.active = false;
        this.showResult(false);
    }

    storePosition() {
        this.closePricePos = this.closeBitcoinLabel.node.position;
        this.movingClosePriceFromPos = BitcoinMasterUtils.convertCurrentBitcoinPosition(
            this.currentCandleValue,
            this.closeBitcoinLabel.node
        );
        this.gapAmountPos = this.gapAmountComp.gapAmount.node.position;
        this.movingGapAmountFromPos = BitcoinMasterUtils.convertCurrentBitcoinPosition(
            this.currentCandleValue,
            this.gapAmountComp.gapAmount.node
        );
        this.evenOddResultPos = this.evenOddResultLabel.node.position;
        this.movingEvenOddResultFromPos = BitcoinMasterUtils.convertCurrentBitcoinPosition(
            this.currentCandleValue,
            this.evenOddResultLabel.node
        );
    }

    resetPosition(currentTimeRemaining) {
        if (currentTimeRemaining <= 105) {
            this.showResult(false);
            this.closeBitcoinLabel.node.position = this.movingClosePriceFromPos;
            this.gapAmountComp.gapAmount.node.position = this.movingGapAmountFromPos;
            this.gapAmountComp.icon.node.position = cc.v3(0, 0, 0);
            this.evenOddResultLabel.node.position = this.movingEvenOddResultFromPos;
        }
    }

    showResult(show = true) {
        this.closeBitcoinLabel.node.active = show;
        this.gapAmountComp.gapAmount.node.active = show;
        this.evenOddResultLabel.node.active = show;
        this.line.active = show;
    }

    movingResult(animated = true) {
        this.showResult();
        if (animated) {
            const duration = 0.8;
            cc.tween(this.node)
                .call(() => {
                    this.line.opacity = 0;
                    BitcoinMasterUtils.moveAnimation(
                        duration,
                        this.closeBitcoinLabel.node,
                        this.closePricePos,
                        this.movingClosePriceFromPos
                    );
                })
                .delay(duration - 0.3)
                .call(() => {
                    cc.tween(this.line).to(0.2, { opacity: 255 }, { easing: "sineOut" }).start();
                })
                .start();

            BitcoinMasterUtils.moveAnimation(duration, this.gapAmountComp.gapAmount.node, this.gapAmountPos, this.movingGapAmountFromPos);
            BitcoinMasterUtils.moveAnimation(
                duration,
                this.evenOddResultLabel.node,
                this.evenOddResultPos,
                this.movingEvenOddResultFromPos
            );
        } else {
            this.closeBitcoinLabel.node.position = this.closePricePos;
            this.gapAmountComp.gapAmount.node.position = this.gapAmountPos;
            this.evenOddResultLabel.node.position = this.evenOddResultPos;
        }
    }

    setData(data: any) {
        this.closeBitcoinLabel.string = BitcoinMasterUtils.formattingBitcoinValue(data.close);
        this.gapAmountComp.setData(data);
        this.gapAmountComp.icon.node.position = this.gapAmountComp.isUpResult ? this.upIconPos.position : this.downIconPos.position;

        const evenOddValue = BitcoinMasterUtils.getEvenOddResult(data.close);
        this.evenOddResultLabel.string = evenOddValue;
        const color = cc.Color.WHITE;
        this.evenOddResultLabel.node.color = parseFloat(evenOddValue) % 2 ? color.fromHEX("#f3485f") : color.fromHEX("#bac5ca");
    }
}
