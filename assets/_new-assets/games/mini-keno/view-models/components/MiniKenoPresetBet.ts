import * as helper from '../../../../../_new-assets/common/helpers/Helper';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoPresetBet extends cc.Component {
    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    main: cc.Node = null;

    @property(cc.Label)
    betValue: cc.Label = null;

    @property(cc.Button)
    betButton: cc.Button = null;

    private betAmount = 0;
    public onChangedBet = (betAmount: number) => { };
    public getPreset = () => { return 0 };
    private commonDialog: any;
    private isOpened = false;

    onLoad() {
        this.commonDialog = this.main.getComponent("CommonDialog");
        this.commonDialog.onDidHide = () => { this.node.active = false; };
        this.commonDialog.onWillShow = () => { this.node.active = true; };
    }

    onEnable() {
        this.betAmount = this.getPreset();
        this.updateBetAmount();
    }

    public clearBet() {
        cc.RedT.audio.playClick();
        this.betAmount = 0;
        this.updateBetAmount();
    }

    public onClose() {
        cc.RedT.audio.playClick();
        this.close();
    }

    public close() {
        this.isOpened = false;
        this.commonDialog.closeDialog();
    }

    public onResetBet() {
        this.close();
        this.clearBet();
        this.onChangedBet(this.betAmount);
    }

    public onAcceptBet() {
        this.close();
        this.onChangedBet(this.betAmount);
    }

    public onItemBetClicked(e) {
        cc.RedT.audio.playClick();
        const amount = +e.target.name;
        this.betAmount = this.betAmount + amount;
        this.updateBetAmount();
    }

    public show() {
        this.isOpened = true;
        this.commonDialog.showDialog();
    }

    public toggle() {
        if (this.isOpened) {
            this.close();
        } else {
            this.show();
        }
    }

    private updateBetAmount() {
        this.betValue.string = helper.numberWithCommas(this.betAmount);
    }
}
