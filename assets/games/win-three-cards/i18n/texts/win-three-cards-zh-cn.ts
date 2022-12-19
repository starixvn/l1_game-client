import { reloadLanguageData } from "../../../../common/i18n/CustomLanguageData";

export const phrases = {
    gameNames: {
        61: "Win Three Cards"
    },
    lobbyNames: {
        61: "Win Three Cards"
    },
    winThreeCards: {
        dragon: "龙",
        phoenix: "凤",
        result: "Result (龙 | 凤)",
        killer235: "235",
        threeOfAKind: "三条",
        straightFlush: "同花顺",
        flush: "同花",
        straight: "顺子",
        onePair: "一对",
        highCard: "高牌",
        pair8Plus: "Pair 8 Plus",
        dragon_win: "龙 Win",
        phoenix_win: "Phoenix Win",
        pair8PlusInfo: "Pair 9 to Pair A, Flush, Straight, Three of a kind, Straight Flush",
        handInfo: "Three of a Kind > Straight Flush > Flush > Straight > Pair > High Card",
        tie: "平局",
        pair8PlusSta: "Pair 8 +:",
        dragonSta: "龙:",
        phoenixSta: "凤:",
        dragonShort: "龙",
        phoenixShort: "凤"
    }
};

reloadLanguageData("zh_cn", phrases);
