import { BundleManager } from "bundle-management";

import SlotGameTicketDetail from "./SlotGameTicketDetail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotGameTicketDetail extends SlotGameTicketDetail {
    @property({ type: cc.SpriteAtlas, override: true, visible: false })
    mainAtlas: cc.SpriteAtlas = null;

    private paylinesAtlas: cc.SpriteAtlas;
    gameId: number;

    async loadPaylineAtlas() {
        const path = `shared/slot-game/textures/standard-slot-dialog`;
        try {
            this.paylinesAtlas = await new Promise((resolve) => {
                cc.resources.load<cc.SpriteAtlas>(path, cc.SpriteAtlas, (err, atlas) => {
                    resolve(atlas);
                });
            });
        } catch (e) {
            console.warn(`Missing Payline spriteAtlas for ${path} `, e);
        }
    }

    async loadSymbolsAtlas() {
        const path = `textures/standard-slot-game`;
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
