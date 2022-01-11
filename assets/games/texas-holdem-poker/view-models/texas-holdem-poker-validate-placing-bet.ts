import * as i18n from "i18n/runtime-scripts/LanguageData";

import { numberWithCommas } from "../../../common/helpers/NumberHelper";

export const validateAccountBalance = (props: {
    chipAmount: number;
    currentBettedAmount: number;
    userBalance: number;
    showMiniWarningFunc: Function;
}): boolean => {
    const { chipAmount, currentBettedAmount, userBalance, showMiniWarningFunc } = props;
    const conditions: { condition: boolean; message?: string; hasIcon?: boolean }[] = [
        {
            condition: isNotEnoughMoney(userBalance, chipAmount, currentBettedAmount),
            message: i18n.t("common.notEnoughMoney")
        }
    ];

    return showMiniWarning(conditions, showMiniWarningFunc);
};

export const validateAccountBalanceForFullRound = (props: {
    chipAmount: number;
    currentBettedAmount: number;
    userBalance: number;
    showMiniWarningFunc: Function;
}): boolean => {
    const { chipAmount, currentBettedAmount, userBalance, showMiniWarningFunc } = props;
    const conditions: { condition: boolean; message?: string; hasIcon?: boolean }[] = [
        {
            condition: isNotEnoughMoneyFullRound(userBalance, chipAmount, currentBettedAmount),
            message: i18n.t("texasPoker.notEnoughMoney")
        }
    ];
    return showMiniWarning(conditions, showMiniWarningFunc);
};

export const showMiniWarning = (
    conditions: { condition: boolean; message?: string; hasIcon?: boolean }[],
    showMiniWarningFunc: Function
): boolean => {
    const criteria = conditions.reduce((result, element) => (!result && element.condition ? element : result), undefined);
    if (criteria && criteria.message) {
        showMiniWarningFunc(criteria.message);
    }

    return !criteria;
};

const isNotEnoughMoney = (userBalance: number, amount: number, currentBettedAmount: number = 0): boolean => {
    return +amount + +currentBettedAmount > userBalance;
};
const isNotEnoughMoneyFullRound = (userBalance: number, amount: number, currentBettedAmount: number = 0): boolean => {
    return (+amount + +currentBettedAmount) * 3 > userBalance;
};
export const validateBet = (props: {
    chipAmount: number;
    currentBettedAmount: number;
    currentTotalBettedAmount: number;
    betChoice: string;
    showMiniWarningFunc: Function;
    minBet: number;
    maxBetPerChoice: number;
    maxBetPerRound: number;
    waitingProcessing: boolean;
}): boolean => {
    const {
        chipAmount,
        currentBettedAmount = 0,
        betChoice,
        showMiniWarningFunc,
        minBet,
        maxBetPerChoice,
        maxBetPerRound,
        currentTotalBettedAmount,
        waitingProcessing
    } = props;

    const period = "common.period";
    if (waitingProcessing) {
        return false;
    }
    const conditions: { condition: boolean; message?: string; hasIcon?: boolean }[] = [
        {
            condition: checkMinBetPerChoice(minBet, currentBettedAmount, chipAmount),
            message: `${i18n.t("common.minBetChoice")} ${numberWithCommas(minBet)}${i18n.t(period)}`
        },
        {
            condition: checkMaxBetPerChoice(maxBetPerChoice, currentBettedAmount, chipAmount, betChoice),
            message: `${i18n.t("common.maxBetChoice")} ${numberWithCommas(maxBetPerChoice)}${i18n.t(period)}`
        },
        {
            condition: checkTotalBet(maxBetPerRound, chipAmount, currentTotalBettedAmount),
            message: `${i18n.t("common.totalMaxBet")} ${numberWithCommas(maxBetPerRound)}${i18n.t(period)}`
        }
    ];

    const criteria = conditions.reduce((result, element) => (!result && element.condition ? element : result), null);

    if (criteria && criteria.message) {
        showMiniWarningFunc(criteria.message);
    }

    return !criteria;
};

const checkMinBetPerChoice = (minBet: number, amount: number, currentBettedAmount: number = 0) => {
    if (minBet) {
        return minBet > +currentBettedAmount + +amount;
    }

    return false;
};
const checkMaxBetPerChoice = (maxBetChoices: number, amount: number, currentBettedAmount: number = 0, betChoice: string) => {
    if (maxBetChoices) {
        return maxBetChoices < +currentBettedAmount + +amount;
    }

    return false;
};

const checkTotalBet = (maxTotalBet, amount: number, totalBettedAmount) => {
    return totalBettedAmount + amount > maxTotalBet;
};
