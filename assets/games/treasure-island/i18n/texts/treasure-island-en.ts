import { reloadLanguageData } from "../../../../common/i18n/CustomLanguageData";

if (!window.i18n) window.i18n = {};
if (!window.i18n.languages) window.i18n.languages = {};
if (!window.i18n.languages.en) window.i18n.languages.en = {};

export const phrases = {
    treasureIsland: {
        tumpleWin: "Tumble Win",
        totalWin: "Win",
        turboMode: "Turbo Mode",
        trialMode: "Trial Mode",
        betMultiplierX: "Bet Multiplier 20x",
        betLevel: "Bet Level",
        coinValue: "Coin Value",
        congratulation: "Congratulations",
        youWinFreeSpin: "You won",
        multiplier: "Multiplier",
        totalMultiplier: "Total Multiplier",
        no: "No.",
        resultBoard: "Result Board",
        symbolAndNumber: "Win Symbols",
        winAmount: "Win Amount",
        trialModeText: "You are in the Trial Mode",
        freeSpin: "Free Spins",
        extraFreeSpin: "Extra Free Spins",
        autoSpinLeft: "Auto Spins Left",
        bigWinTextNotify: "Press anywhere to continue",
        reachMaxWin: "You reached the Max Win",
        warningTrialMode: "Play Real,\nWin Real"
    }
};

Object.assign(window.i18n.languages.en, phrases);
reloadLanguageData();
