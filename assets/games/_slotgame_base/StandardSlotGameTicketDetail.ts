import { uiManager } from "../../managers/GameUIManager";
import SlotGameTicketDetail from "./SlotGameTicketDetail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotGameTicketDetail extends SlotGameTicketDetail {
    @property({ type: cc.SpriteAtlas, override: true, visible: false })
    mainAtlas: cc.SpriteAtlas = null;

    @property(cc.SpriteAtlas)
    paylinesAtlas: cc.SpriteAtlas = null;

    gameId: number;

    async loadSymbolsAtlas() {
        this.mainAtlas = uiManager.prefabCache.gameAtlas[this.gameId];
    }

    protected getSpriteLine(line: number): cc.SpriteFrame {
        return this.paylinesAtlas.getSpriteFrame(`line-selection-${line + 1}`);
    }

    protected setSymbolFrame(symbolNumber: number) {
        return this.mainAtlas.getSpriteFrame(`symbol-${symbolNumber}`);
    }
}
