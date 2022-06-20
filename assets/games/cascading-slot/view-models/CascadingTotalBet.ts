import AudioManager from "../../../common/audio/AudioManager";
import StatusButton from "../../../common/custom-button/StatusButton";
import CascadingBetControl from "./CascadingBetControl";
import CascadingSlotBase from "./CascadingSlotBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingTotalBet extends cc.Component {
    @property(StatusButton)
    buttonIncrease: StatusButton = null;

    @property(StatusButton)
    buttonDecrease: StatusButton = null;

    @property(cc.Label)
    totalBetLabel: cc.Label = null;

    @property(cc.Node)
    disabled: cc.Node = null;

    @property(StatusButton)
    totalBetImg: StatusButton = null;

    protected betControl: CascadingBetControl;
    protected isOpenBetControl = false;
    protected mainGame: CascadingSlotBase;
    protected increaseButtonStatus = true;
    protected decreaseButtonStatus = true;

    onLoad() {
        this.setAllowChangeBet(false);
    }

    initData(betControl: CascadingBetControl) {
        this.betControl = betControl;
    }

    onClickOpenBetControl() {
        this.betControl.showView(!this.isOpenBetControl, () => {
            this.onClickOpenBetControl();
        });
        this.isOpenBetControl = !this.isOpenBetControl;
    }

    onHandleStatusBetControl(event: Event, customEventData: string) {
        AudioManager.getInstance().playClick();

        this.betControl.showView(
            !this.isOpenBetControl,
            () => {
                this.onClickOpenBetControl();
            },
            customEventData
        );
        this.isOpenBetControl = !this.isOpenBetControl;
    }

    setAllowChangeBet(status: boolean) {
        this.buttonIncrease.interactable = status && this.increaseButtonStatus;
        this.buttonDecrease.interactable = status && this.decreaseButtonStatus;
        this.totalBetImg.interactable = status;
        this.disabled.active = !status;
    }

    setIncreaseButtonStatus(status: boolean) {
        this.increaseButtonStatus = status;
        this.buttonIncrease.interactable = status;
    }

    setDecreaseButtonStatus(status: boolean) {
        this.decreaseButtonStatus = status;
        this.buttonDecrease.interactable = status;
    }
}
