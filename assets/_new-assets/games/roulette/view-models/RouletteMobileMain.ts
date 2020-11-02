import RouletteMain from "./RouletteMain";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteMobileMain extends RouletteMain {

    @property(cc.Node)
    quickBetButton: cc.Node = null;

    @property(cc.Node)
    regularBetButton: cc.Node = null;

    @property(cc.Node)
    smallRegularBetNode: cc.Node = null;

    // private quickBetDialog: any;

    onLoad() {
        super.onLoad();
        this.quickBetButton.active = true;
        this.regularBetButton.active = false;
        // this.quickBetDialog = this.quickBet.getComponent("CommonDialog");
        this.quickBet.node.opacity = 0;
        this.quickBet.node.active = false;
        this.backgroundWheel.active = false;
        this.wheel.node.y = this.wheelHidePositionY;
        this.quickBetButton.parent.runAction(cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.8, 1.05).easing(cc.easeSineInOut()),
                cc.scaleTo(0.8, 1.0).easing(cc.easeSineInOut()))
        ));
    }

    enableQuickBet(enable: boolean) {
        this.quickBetButton.getComponent(cc.Button).interactable = enable;
    }

    switchToQuickBet() {
        cc.RedT.audio.playClick();
        this.quickBetButton.active = false;
        this.regularBetButton.active = true;
        this.quickBet.node.active = true;
        this.quickBet.node.y = this.smallRegularBetNode.y;
        this.quickBet.node.scale = 0;

        cc.tween(this.quickBet.node)
            .parallel(
                cc.tween().to(0.2, { opacity: 255 }, { easing: "sineOut" }),
                cc.tween().to(0.2, { scale: 1 }, { easing: "sineOut" }),
                cc.tween().to(0.2, { position: cc.v2(0, -74) }, { easing: "sineIn" })
            )
            .start();

        cc.tween(this.board.node)
            .parallel(
                cc.tween().to(0.2, { position: cc.v2(0, this.smallRegularBetNode.y) }, { easing: "sineIn" }),
                cc.tween().to(0.2, { scale: 0.452 }, { easing: "sineOut" })
            )
            .start();
        // this.quickBetDialog.showDialog();
    }

    switchToRegularBet() {
        this.board.clearHighlight();

        cc.RedT.audio.playClick();
        this.quickBetButton.active = true;
        this.regularBetButton.active = false;

        // this.quickBetDialog.closeDialog(false);
        cc.tween(this.quickBet.node)
            .parallel(
                cc.tween().to(0.2, { opacity: 0 }, { easing: "sineIn" }),
                cc.tween().to(0.2, { scale: 0 }, { easing: "sineIn" }),
                cc.tween().to(0.2, { position: cc.v2(0, this.smallRegularBetNode.y) }, { easing: "sineOut" })
            )
            .start();

        cc.tween(this.board.node)
            .parallel(
                cc.tween().to(0.2, { position: cc.v2(0, 8) }, { easing: "sineOut" }),
                cc.tween().to(0.2, { scale: 1 }, { easing: "sineIn" })
            )
            .start();

    }

    showRoulette(result: number, onComplete: () => void) {

        this.wheel.showResult(result, () => {
            cc.tween(this.node)
                .delay(2)
                .call(() => {
                    this.hideRoulette();
                    onComplete();
                })
                .start();
        });

        this.backgroundWheel.active = true;
        this.wheel.node.runAction(cc.moveTo(0.5, cc.v2(0, 0)));
    }

    hideRoulette() {
        super.hideRoulette();
        this.wheel.node.runAction(cc.sequence(
            cc.moveTo(0.5, cc.v2(0, this.wheelHidePositionY)),
            cc.callFunc(() => this.backgroundWheel.active = false)
        ));
    }
}
