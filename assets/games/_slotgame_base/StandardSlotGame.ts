import { BundleManager } from "bundle-management";

import GameUIManager from "../../lobby/main/view-models/GameUIManager";
import SlotGameBase from "./SlotGameBase";
import { StandardSlotGameConfigs } from "./StandardSlotGameConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotGame extends SlotGameBase {
    @property
    protected _gameId = 0;
    @property
    public get gameId(): number {
        return this._gameId;
    }
    public set gameId(value) {
        this._gameId = value;
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new StandardSlotGameConfigs();
    }

    initSlotBoard() {
        this.loadSlotSymbols().then(() => {
            super.initSlotBoard();
        });
    }

    async loadSlotSymbols() {
        const prefabCache = GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId] || {};
        for (let index = 0; index < 11; index++) {
            if (prefabCache[index]) {
                continue;
            }
            const path = `preload/symbols/${index}`;
            const devPath = `../games/*/${path}`;
            const prefab = await BundleManager.getInstance().loadAsset<cc.Prefab>({
                bundleId: this.gameId.toString(),
                path: path,
                pathForDevMode: devPath,
                type: cc.Prefab
            });

            prefabCache[index] = prefab;
        }

        GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId] = prefabCache;
    }
}
