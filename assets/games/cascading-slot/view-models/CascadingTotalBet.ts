import StatusButton from "../../../common/custom-button/StatusButton";

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
}
