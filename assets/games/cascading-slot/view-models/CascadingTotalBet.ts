import StatusButton from "../../../common/custom-button/StatusButton";
import CascadingBetControl from "./CascadingBetControl";
import CascadingSlotBase from "./CascadingSlotBase";

const { ccclass, property } = cc._decorator;

export type TotalBetType = { totalBet: number; increase: boolean; decrease: boolean };

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

    initData(betControl: CascadingBetControl) {
        this.betControl = betControl;
        this.setStatusTotalBet(false);
    }

    onClickOpenBetControl() {
        this.betControl.showView(!this.isOpenBetControl, () => {
            this.onClickOpenBetControl();
        });
        this.isOpenBetControl = !this.isOpenBetControl;
    }

    onHandleStatusBetControl(event: Event, customEventData: string) {
        this.betControl.showView(
            !this.isOpenBetControl,
            () => {
                this.onClickOpenBetControl();
            },
            customEventData
        );
        this.isOpenBetControl = !this.isOpenBetControl;
    }

    setStatusTotalBet(status: boolean) {
        this.disabled.active = status;
        this.totalBetImg.interactable = !status;
    }
}
