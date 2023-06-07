import { getLocale } from "../../common/auth/SessionManager";
import GameUtils from "../../common/GameUtils";
import { uiManager } from "../../managers/GameUIManager";
import SlotGameHistoryItem from "./SlotGameHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotGameHistoryItem extends SlotGameHistoryItem {
    setData(betLog, index, gameId) {
        super.setData(betLog, index, gameId);
        this.win.node.color = betLog.betWin > 0 ? this.textHighlightColor : this.textNormalColor;
    }

    protected getJackpotWinningByCurrency(winningAmount: number) {
        return GameUtils.getValueByCurrency(winningAmount);
    }

    protected showJackpotIcon(jackpot, gameId) {
        if (jackpot !== null) {
            const gameAtlas = uiManager.prefabCache.gameAtlas[gameId];
            const sprite = this.jackpotIcon.getComponent(cc.Sprite);
            const suffix = getLocale() === "vi-VN" ? `.${getLocale()}` : "";
            gameAtlas && (sprite.spriteFrame = gameAtlas.getSpriteFrame(`history-jackpot${suffix}`));
            this.jackpotIcon.active = true;
        } else {
            this.jackpotIcon.active = false;
        }
    }
}
