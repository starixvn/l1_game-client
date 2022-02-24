const { ccclass, property } = cc._decorator;

export const BettingAreaEvents = {
    PLACING_BET: "PLACING BET"
};

@ccclass
export default class HiLoBettingArea extends cc.Component {
    @property(cc.String)
    betChoice = "";

    @property(cc.Node)
    disableLayer: cc.Node = null;

    @property(cc.Animation)
    animation: cc.Animation = null;

    placingBet() {
        this.animation.play("pressed");
        this.node.emit(BettingAreaEvents.PLACING_BET, this.betChoice);
    }

    enableBetChoice(status: boolean) {
        const delayTime = status ? 0 : 0.5;
        cc.tween(this.node)
            .delay(delayTime)
            .call(() => {
                this.disableLayer.active = !status;
            })
            .start();
    }
}
