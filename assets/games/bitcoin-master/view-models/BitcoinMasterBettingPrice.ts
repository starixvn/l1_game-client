import BitcoinMasterUtils from "./BitcoinMasterUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterBettingPrice extends cc.Component {
    @property(cc.Label)
    bettingPrice: cc.Label = null;

    @property(cc.Node)
    line: cc.Node = null;

    @property(cc.Node)
    currentCandleValue: cc.Node = null;

    private toPosition: cc.Vec3;
    private fromPosition: cc.Vec3;

    storePosition() {
        this.toPosition = this.bettingPrice.node.position;
        this.fromPosition = BitcoinMasterUtils.convertCurrentBitcoinPosition(this.currentCandleValue, this.bettingPrice.node);
    }

    resetPosition() {
        this.bettingPrice.node.position = this.toPosition;
        this.bettingPrice.node.active = false;
        this.line.active = false;
    }

    setData(data: any, animated = true) {
        if (data.open && !data.close) {
            this.line.active = true;
            this.bettingPrice.node.active = true;
            this.bettingPrice.string = BitcoinMasterUtils.formattingBitcoinValue(data.open);
            const duration = 0.4;
            if (animated) {
                this.line.opacity = 0;
                cc.tween(this.node)
                    .call(() => BitcoinMasterUtils.moveAnimation(duration, this.bettingPrice.node, this.toPosition, this.fromPosition))
                    .delay(duration - 0.3)
                    .call(() => {
                        cc.tween(this.line).to(0.2, { opacity: 255 }, { easing: "sineOut" }).start();
                    })
                    .start();
            }
        }
    }
}
