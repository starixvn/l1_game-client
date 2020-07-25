import RouletteMain from "./RouletteMain";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteMobileMain extends RouletteMain {

    @property(cc.Node)
    quickBetButton: cc.Node = null;

    @property(cc.Node)
    regularBetButton: cc.Node = null;

    @property(cc.Node)
    backgroundQuickBet: cc.Node = null;

    @property(cc.Node)
    backgroundWheel: cc.Node = null;

    private quickBetDialog: any;
    private wheelHidePositionY = 1000;

    onLoad() {
        super.onLoad();
        this.quickBetButton.active = true;
        this.regularBetButton.active = false;
        this.backgroundQuickBet.active = false;
        this.quickBetDialog = this.quickBet.getComponent("CommonDialog");
        this.quickBetDialog.onWillShow = () => this.backgroundQuickBet.active = true;
        this.quickBetDialog.onDidHide = () => this.backgroundQuickBet.active = false;
        this.quickBetDialog.closeDialog(false);
        this.backgroundWheel.active = false;
        this.wheel.node.y = this.wheelHidePositionY;
    }

    switchToQuickBet() {
        // cc.RedT.audio.playClick();
        this.quickBetButton.active = false;
        this.regularBetButton.active = true;

        this.quickBetDialog.showDialog();
    }

    switchToRegularBet() {
        // cc.RedT.audio.playClick();
        this.quickBetButton.active = true;
        this.regularBetButton.active = false;

        this.quickBetDialog.closeDialog(false);
    }

    showRoulette() {
        this.backgroundWheel.active = true;
        this.wheel.node.runAction(cc.moveTo(1, cc.v2(0, 0)));
    }

    hideRoulette() {
        this.wheel.node.runAction(cc.sequence(
            cc.moveTo(1, cc.v2(0, this.wheelHidePositionY)),
            cc.callFunc(() => this.backgroundWheel.active = false)
        ));
    }
}
