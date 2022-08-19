const { ccclass, property } = cc._decorator;

export const BoostedOddsEvent = {
    SHOW_PROMOTION_ANNOUNCEMENT: "SHOW_PROMOTION_ANNOUNCEMENT"
};
@ccclass
export default class BoostedOdds extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    handleBoostedOdds() {
        console.log("handleBoostedOdds");
        cc.tween(this.content).to(0.2, { opacity: 255 }).delay(5).to(0.1, { opacity: 0 }).start();
    }

    onDisable() {
        this.node.stopAllActions();
    }

    onClickBoostedOdds() {
        this.node.emit(BoostedOddsEvent.SHOW_PROMOTION_ANNOUNCEMENT);
    }
}
