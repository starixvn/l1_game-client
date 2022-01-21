const { ccclass, property } = cc._decorator;

export const BettingAreaEvents = {
    PLACING_BET: "PLACING BET"
};

@ccclass
export default class HiLoBettingArea extends cc.Component {
    @property(cc.String)
    betChoice: string = "";

    @property(cc.Node)
    disableLayer: cc.Node = null;

    placingBet() {
        this.node.emit(BettingAreaEvents.PLACING_BET, this.betChoice);
    }

    disableBetChoice(status: boolean) {
        this.disableLayer && (this.disableLayer.active = status);
    }
}
