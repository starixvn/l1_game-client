import { i18n } from "../../ClientModules";

export const getCardsResult = (result: number) => {
    let resultText: string;

    switch (result) {
        case 1:
            resultText = i18n.t("winThreeCards.highCard");
            break;
        case 2:
            resultText = i18n.t("winThreeCards.onePair");
            break;
        case 3:
            resultText = i18n.t("winThreeCards.straight");
            break;
        case 4:
            resultText = i18n.t("winThreeCards.flush");
            break;
        case 5:
            resultText = i18n.t("winThreeCards.straightFlush");
            break;
        case 6:
            resultText = i18n.t("winThreeCards.threeOfAKind");
            break;
        case 7:
            resultText = i18n.t("winThreeCards.killer235");
            break;
    }

    return resultText;
};

export const changeCacheMode = (label: cc.Label) => {
    const lang = window.i18n.curLang;
    switch (lang) {
        case "th":
        case "zh_cn":
        case "zh_tw":
            label.cacheMode = cc.Label.CacheMode.BITMAP;
            return;
        default:
            label.cacheMode = cc.Label.CacheMode.CHAR;
            return;
    }
};

export const convertRank = (num: number): string => {
    num++;
    const dict = {
        11: "J",
        12: "Q",
        13: "K",
        1: "A",
        0: " "
    };
    return dict[num] || num.toString();
};
