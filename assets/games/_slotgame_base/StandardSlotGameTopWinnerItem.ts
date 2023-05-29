import { lodash } from "../../ClientModules";
import GameUtils from "../../common/GameUtils";
import { numberWithCommas } from "./../../common/helpers/NumberHelper";
import SlotGameTopWinnerItem from "./SlotGameTopWinnerItem";

const { ccclass } = cc._decorator;

@ccclass
export default class StandardSlotGameTopWinnerItem extends SlotGameTopWinnerItem {
    private basePool = [1, 10, 50];

    setOtherValues(player, showBigWin) {
        const { freeSpin, baseTotalAmount, baseWinningAmount, winningAmount, bet } = player;
        let amountValue;

        if (showBigWin) {
            amountValue = freeSpin ? "Free Spin" : numberWithCommas(GameUtils.getValueByCurrency(baseTotalAmount), 1);
        } else {
            const index = lodash.indexOf(this.basePool, bet);
            amountValue = numberWithCommas(this.stakeLevels[index], 1);
        }

        this.amount.string = amountValue;
        this.win.string = showBigWin
            ? numberWithCommas(GameUtils.getValueByCurrency(baseWinningAmount), 2)
            : numberWithCommas(GameUtils.getValueByCurrency(winningAmount), 2);
    }
}
