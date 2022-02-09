import * as i18n from "i18n/runtime-scripts/LanguageData";

import { numberWithCommas } from "../../../common/helpers/NumberHelper";

export const validateAccountBalance = (props: {
    chipAmount: number;
    currentBettedAmount: number;
    userBalance: number;
    showMiniWarningFunc: (data: any) => void;
}): boolean => {
    const { chipAmount, currentBettedAmount, userBalance, showMiniWarningFunc } = props;
    const conditions: { condition: boolean; message?: string; hasIcon?: boolean }[] = [
        {
            condition: isNotEnoughMoney(userBalance, chipAmount, currentBettedAmount),
            message: i18n.t("messages.notEnoughMoney")
        }
    ];

    return showMiniWarning(conditions, showMiniWarningFunc);
};

export const validateAccountBalanceForFullRound = (props: {
    chipAmount: number;
    currentBettedAmount: number;
    userBalance: number;
    showMiniWarningFunc: (data: any) => void;
}): boolean => {
    const { chipAmount, currentBettedAmount, userBalance, showMiniWarningFunc } = props;
    const conditions: { condition: boolean; message?: string; hasIcon?: boolean }[] = [
        {
            condition: isNotEnoughMoneyFullRound(userBalance, chipAmount, currentBettedAmount),
            message: i18n.t("messages.notEnoughMoneyCardGame")
        }
    ];
    return showMiniWarning(conditions, showMiniWarningFunc);
};

export const showMiniWarning = (
    conditions: { condition: boolean; message?: string; hasIcon?: boolean }[],
    showMiniWarningFunc: (data: any) => void
): boolean => {
    const criteria = conditions.reduce((result, element) => (!result && element.condition ? element : result), undefined);
    if (criteria && criteria.message) {
        showMiniWarningFunc(criteria.message);
    }

    return !criteria;
};

const isNotEnoughMoney = (userBalance: number, amount: number, currentBettedAmount = 0): boolean => {
    return +amount + +currentBettedAmount > userBalance;
};
const isNotEnoughMoneyFullRound = (userBalance: number, amount: number, currentBettedAmount = 0): boolean => {
    return (+amount + +currentBettedAmount) * 3 > userBalance;
};
export const validateBet = (props: {
    chipAmount: number;
    currentBettedAmount: number;
    currentTotalBettedAmount: number;
    betChoice: string;
    showMiniWarningFunc: (data: any) => void;
    minBet: number;
    maxBetPerChoice: number;
    maxBetPerRound: number;
    waitingProcessing: boolean;
    getMaxBetAndStakePerChoice: (betChoice: string) => number;
    minBetPerRound: number;
}): boolean => {
    const {
        chipAmount,
        currentBettedAmount = 0,
        showMiniWarningFunc,
        minBet,
        maxBetPerChoice,
        maxBetPerRound,
        currentTotalBettedAmount,
        waitingProcessing,
        getMaxBetAndStakePerChoice,
        minBetPerRound,
        betChoice
    } = props;

    if (waitingProcessing) {
        return false;
    }
    const conditions: {
        condition: boolean;
        message?: string;
        hasIcon?: boolean;
        getMaxBetAndStakePerChoice?: (betChoice: string) => number;
        minBetPerRound?: number;
        maxBetPerRound?: number;
        betChoice?: string;
    }[] = [
        {
            condition: checkMinBetPerChoice(minBet, currentBettedAmount, chipAmount),
            message: i18n.t("messages.minBetForChoiceNotice", {
                maxBet: numberWithCommas(minBetPerRound)
            })
        },
        {
            condition: checkMaxBetPerChoice(maxBetPerChoice, currentBettedAmount, chipAmount, getMaxBetAndStakePerChoice, betChoice),
            message: i18n.t("messages.maxBetForChoiceNotice2", {
                maxBet: numberWithCommas(getMaxBetAndStakePerChoice(betChoice))
            })
        },
        {
            condition: checkTotalBet(maxBetPerRound, chipAmount, currentTotalBettedAmount),
            message: i18n.t("messages.maxBetNotice", {
                maxBet: numberWithCommas(maxBetPerRound)
            })
        }
    ];

    const criteria = conditions.reduce((result, element) => (!result && element.condition ? element : result), null);

    if (criteria && criteria.message) {
        showMiniWarningFunc(criteria.message);
    }

    return !criteria;
};

const checkMinBetPerChoice = (minBet: number, amount: number, currentBettedAmount = 0) => {
    if (minBet) {
        return minBet > +currentBettedAmount + +amount;
    }

    return false;
};
const checkMaxBetPerChoice = (
    maxBetPerChoice: number,
    amount: number,
    currentBettedAmount = 0,
    getMaxBetAndStakePerChoice: (betChoice: string) => number,
    betChoice: string
) => {
    if (maxBetPerChoice) {
        return getMaxBetAndStakePerChoice(betChoice) < +currentBettedAmount + +amount;
    }

    return false;
};

const checkTotalBet = (maxTotalBet, amount: number, totalBettedAmount) => {
    return totalBettedAmount + amount > maxTotalBet;
};
