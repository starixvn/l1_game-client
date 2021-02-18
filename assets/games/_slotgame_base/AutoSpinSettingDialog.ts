import CommonDialog from '../../common/_base/view-models/CommonDialog';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoSpinSettingDialog extends cc.Component {
    @property(CommonDialog)
    dialog: CommonDialog = null;

    @property(cc.Node)
    choicesContainer: cc.Node = null;

    public onConfirmCallback = (autoSpinCount: number) => {};
    public onCancelCallback = () => {};
    private autoSpinCount = 10;
    private confirmed = false;

    onLoad() {
        const defaultSpin = this.choicesContainer.children[0].name || 10;
        this.autoSpinCount = +defaultSpin;

        this.dialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    onChoiceClick(event: cc.Event, param: string) {
        cc.RedT.audio.playClick();
        this.autoSpinCount = +param;
    }

    onCloseClick() {
        cc.RedT.audio.playClick();
        this.dialog.closeDialog();
    }

    onConfirmClick() {
        cc.RedT.audio.playClick();
        this.confirmed = true;
        this.dialog.closeDialog();
    }

    onDestroy() {
        if (this.confirmed) {
            this.onConfirmCallback(this.autoSpinCount);
        } else {
            this.onCancelCallback();
        }
    }
}
