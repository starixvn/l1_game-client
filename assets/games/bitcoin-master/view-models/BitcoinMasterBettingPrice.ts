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

    hideBettingPrice(opacity = 0) {
        this.bettingPrice.node.opacity = opacity;
        this.line.opacity = opacity;
    }

    setData(data: any, animated = true) {
        if (data.open && !data.close) {
            this.hideBettingPrice();
            this.bettingPrice.string = BitcoinMasterUtils.formattingBitcoinValue(data.open);
            const duration = 0.4;
            if (animated) {
                cc.tween(this.node)
                    .call(() => BitcoinMasterUtils.moveAnimation(duration, this.bettingPrice.node, this.toPosition, this.fromPosition))
                    .delay(duration - 0.3)
                    .call(() => {
                        cc.tween(this.line).to(0.2, { opacity: 255 }, { easing: "sineOut" }).start();
                    })
                    .start();
            } else {
                this.hideBettingPrice(255);
            }
        }
    }
}
