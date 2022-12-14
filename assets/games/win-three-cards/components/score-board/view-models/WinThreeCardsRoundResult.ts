import * as i18n from "i18n/runtime-scripts/LanguageData";
const { ccclass, property } = cc._decorator;

@ccclass
export default class WinThreeCardsRoundResult extends cc.Component {
    @property(cc.Sprite)
    backgroundColor: cc.Sprite[] = [];

    @property(cc.Label)
    text: cc.Label[] = [];

    changeColorText(result) {
        // handle
    }

    changeBackgroundColor(result) {
        // handle
    }

    changeValueText(result) {
        // handle
        // i18n.t("winThreeCards.threeOfAKind")
    }
}
