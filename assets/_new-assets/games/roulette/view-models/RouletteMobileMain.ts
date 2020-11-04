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

    @property(cc.Node)
    switchQuickBetTime: cc.Node = null;

    // private quickBetDialog: any;
    private prevQuickBetPosition = cc.v2();
    private prevRegularBetPosition = cc.v2();
    private prevTimePosition = cc.v2();

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

        this.prevQuickBetPosition = this.quickBet.node.position;
        this.prevRegularBetPosition = this.board.node.position;
        this.prevTimePosition = this.timeWaitNode.parent.position;
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
            .to(0.2, {
                opacity: { value: 255, easing: "sineOut" },
                scale: { value: 1, easing: "sineIn" },
                position: { value: this.prevQuickBetPosition, easing: "sineIn" }
            })
            .start();

        cc.tween(this.board.node)
            .to(0.2, {
                scale: { value: 0.452, easing: "sineOut" },
                position: { value: this.smallRegularBetNode.position, easing: "sineIn" }
            })
            .start();

        cc.tween(this.timeWaitNode.parent)
            .to(0.2, { position: this.switchQuickBetTime.position }, { easing: "sineIn" })
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
            .to(0.2, {
                opacity: { value: 0, easing: "sineIn" },
                scale: { value: 0, easing: "sineOut" },
                position: { value: this.smallRegularBetNode.position, easing: "sineOut" }
            })
            .start();

        cc.tween(this.board.node)
            .to(0.2, {
                scale: { value: 1, easing: "sineIn" },
                position: { value: this.prevRegularBetPosition, easing: "sineOut" }
            })
            .start();

        cc.tween(this.timeWaitNode.parent)
            .to(0.2, { position: this.prevTimePosition }, { easing: "sineOut" })
            .start();

    }
}
