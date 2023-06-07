import { lodash } from "../../ClientModules";
import GameUtils from "../../common/GameUtils";
import { numberWithCommas } from "./../../common/helpers/NumberHelper";
import SlotGameTopWinnerItem from "./SlotGameTopWinnerItem";

const { ccclass } = cc._decorator;

@ccclass
export default class StandardSlotGameTopWinnerItem extends SlotGameTopWinnerItem {
    private basePool = [1, 10, 50];

    setOtherValues(player, showBigWin) {
        const { freeSpin, totalAmount, winningAmount, bet, exchangeRateCode, rate, baseTotalAmount, baseWinAmount } = player;
        const { baseStakeLevels, stakeLevels } = this.gameConfigs;
        let amountValue;

        if (showBigWin) {
            amountValue = freeSpin
                ? "Free Spin"
                : numberWithCommas(GameUtils.getValueByExchangeRateCode(baseTotalAmount ?? totalAmount * rate, exchangeRateCode), 1);
        } else {
            const index = lodash.indexOf(baseStakeLevels, bet);
            amountValue = numberWithCommas(stakeLevels[index], 1);
        }

        this.amount.string = amountValue;
        this.win.string = showBigWin
            ? numberWithCommas(GameUtils.getValueByExchangeRateCode(baseWinAmount ?? winningAmount * rate, exchangeRateCode), 2)
            : numberWithCommas(GameUtils.getValueByExchangeRateCode(winningAmount, exchangeRateCode), 2);
    }
}
