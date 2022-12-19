import { reloadLanguageData } from "../../../../common/i18n/CustomLanguageData";

export const phrases = {
    gameNames: {
        61: "Win Three Cards"
    },
    lobbyNames: {
        61: "Win Three Cards"
    },
    winThreeCards: {
        dragon: "龍",
        phoenix: "鳳",
        result: "Result (Dragon | Phoenix)",
        killer235: "235",
        threeOfAKind: "三條",
        straightFlush: "同花順",
        flush: "同花",
        straight: "順子",
        onePair: "一對",
        highCard: "高牌",
        pair8Plus: "Pair 8 Plus",
        dragon_win: "龍 Win",
        phoenix_win: "Phoenix Win",
        pair8PlusInfo: "Pair 9 to Pair A, Flush, Straight, Three of a kind, Straight Flush",
        handInfo: "Three of a Kind > Straight Flush > Flush > Straight > Pair > High Card",
        tie: "平局",
        pair8PlusSta: "Pair 8 +:",
        dragonSta: "龍:",
        phoenixSta: "鳳:",
        dragonShort: "龍",
        phoenixShort: "鳳"
    }
};

reloadLanguageData("zh_tw", phrases);
