import { BundleManager } from "bundle-management";

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
        const path = `resources/textures/standard-slot-game`;
        const devPath = `../games/*/${path}`;
        try {
            const spriteAtlas = await BundleManager.getInstance().loadAsset<cc.SpriteAtlas>({
                bundleId: this.gameId.toString(),
                path: path,
                pathForDevMode: devPath,
                type: cc.SpriteAtlas
            });
            this.mainAtlas = spriteAtlas;
        } catch (e) {
            console.warn(`Missing Symbols spriteAtlas for ${path} `, e);
        }
    }

    protected getSpriteLine(line: number): cc.SpriteFrame {
        return this.paylinesAtlas.getSpriteFrame(`line-selection-${line + 1}`);
    }

    protected setSymbolFrame(symbolNumber: number) {
        return this.mainAtlas.getSpriteFrame(`symbol-${symbolNumber}`);
    }
}
