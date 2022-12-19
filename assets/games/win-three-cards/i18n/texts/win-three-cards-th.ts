import { reloadLanguageData } from "../../../../common/i18n/CustomLanguageData";

export const phrases = {
    gameNames: {
        61: "Win Three Cards"
    },
    lobbyNames: {
        61: "Win Three Cards"
    },
    winThreeCards: {
        dragon: "มังกร",
        phoenix: "ฟีนิกซ์",
        result: "Result (มังกร | ฟีนิกซ์)",
        killer235: "235",
        threeOfAKind: "ไพ่ตอง ",
        straightFlush: "สเตรทฟลัช",
        flush: "ฟลัช ",
        straight: "สเตรท",
        onePair: "ไพ่คู่",
        highCard: "ไพ่สูง",
        pair8Plus: "Pair 8 Plus",
        dragon_win: "Dragon Win",
        phoenix_win: "Phoenix Win",
        pair8PlusInfo: "Pair 9 to Pair A, Flush, Straight, Three of a kind, Straight Flush",
        handInfo: "Three of a Kind > Straight Flush > Flush > Straight > Pair > High Card",
        tie: "เสมอ",
        pair8PlusSta: "Pair 8 +:",
        dragonSta: "มังกร:",
        phoenixSta: "ฟีนิกซ์:",
        dragonShort: "D",
        phoenixShort: "P"
    }
};

reloadLanguageData("th", phrases);
