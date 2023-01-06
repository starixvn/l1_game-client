import { reloadLanguageData } from "../../../../common/i18n/CustomLanguageData";

export const phrases = {
    gameNames: {
        61: "ชนะไพ่สามใบ"
    },
    lobbyNames: {
        61: "ชนะไพ่สามใบ"
    },
    winThreeCards: {
        dragon: "มังกร",
        phoenix: "ฟีนิกซ์",
        result: "ผลลัพธ์ (มังกร | ฟีนิกซ์)",
        killer235: "235",
        threeOfAKind: "ไพ่ตอง ",
        straightFlush: "สเตรทฟลัช",
        flush: "ฟลัช ",
        straight: "สเตรท",
        onePair: "ไพ่คู่",
        highCard: "ไพ่สูง",
        pair8Plus: "คู่ 8 พลัส",
        dragon_win: "มังกร Win",
        phoenix_win: "ฟีนิกซ์ Win",
        pair8PlusInfo: "คู่ 9 ถึงคู่ A, ฟลัช, สเตรท, ไพ่ตอง, สเตรทฟลัช",
        handInfo: "ไพ่ตอง > สเตรทฟลัช > ฟลัช > สเตรท > คู่ > ไพ่สูง",
        tie: "เสมอ",
        pair8PlusSta: "คู่ 8 พลัส:",
        dragonSta: "มังกร:",
        phoenixSta: "ฟีนิกซ์:",
        dragonShort: "D",
        phoenixShort: "P"
    }
};

reloadLanguageData("th", phrases);
