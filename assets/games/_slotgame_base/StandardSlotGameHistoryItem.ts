import { getLocale } from "../../common/auth/SessionManager";
import { uiManager } from "../../managers/GameUIManager";
import SlotGameHistoryItem from "./SlotGameHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotGameHistoryItem extends SlotGameHistoryItem {
    setData(betLog, index, gameId) {
        super.setData(betLog, index, gameId);
        this.win.node.color = betLog.betWin > 0 ? this.textHighlightColor : this.textNormalColor;
    }

    showJackpotIcon(jackpot, gameId) {
        if (jackpot !== null) {
            const gameAtlas = uiManager.prefabCache.gameAtlas[gameId];
            const sprite = this.jackpotIcon.getComponent(cc.Sprite);
            const language = getLocale();
            sprite.spriteFrame = gameAtlas.getSpriteFrame(`history-jackpot${language === "vi-VN" ? `.${language}` : ""}`);
            this.jackpotIcon.active = true;
        }
    }
}
