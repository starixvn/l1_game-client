import { BundleManager } from "bundle-management";

import AudioManager from "../../common/audio/AudioManager";
import GameUIManager from "../../lobby/main/view-models/GameUIManager";
import SlotGameBase, { SlotGameSound } from "./SlotGameBase";
import StandardSlotBoard from "./StandardSlotBoard";
import { StandardSlotGameConfigs } from "./StandardSlotGameConfigs";
import SymbolPreview from "./SymbolPreview";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotGame extends SlotGameBase {
    @property({ type: cc.Prefab, visible: false, override: true })
    topWinnerPrefab: cc.Node = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    effectJackpot: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    effectBonus: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    effectBigWin: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    effectFreeSpin: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    lineSelectionDialog: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    bonusDialog: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    linePrefab: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    lightLinePrefab: cc.Prefab = null;

    @property({ type: cc.AudioSource, visible: false, override: true })
    soundSources: cc.AudioSource[] = [];

    @property
    protected _gameId = 0;
    @property
    public get gameId(): number {
        return this._gameId;
    }
    public set gameId(value) {
        this._gameId = value;
    }

    protected audioClips = {};
    private previewSymbolLeft: cc.Prefab;
    private previewSymbolRight: cc.Prefab;
    slotBoard: StandardSlotBoard;
    onLoad() {
        this.loadAudios();
        super.onLoad();
    }

    async loadPrefabsByCode() {
        const dict = {
            // prefab name : prefab property
            "top-winner": "topWinnerPrefab",
            "effect-jackpot": "effectJackpot",

            "effect-bonus": "effectBonus",
            "effect-big-win": "effectBigWin",
            "effect-freespin": "effectFreeSpin",

            "dialog-auto-spin": "autoSpinDialogPrefab",
            "dialog-line-selection": "lineSelectionDialog",
            "dialog-bonus": "bonusDialog",
            "line-normal": "linePrefab",
            "line-glow": "lightLinePrefab",

            "preview-symbol-left": "previewSymbolLeft",
            "preview-symbol-right": "previewSymbolRight"
        };

        for (const key of Object.keys(dict)) {
            const path = `preload/prefabs/${key}`;
            const devPath = `../games/*/${path}`;
            try {
                const prefab = await BundleManager.getInstance().loadAsset<cc.Prefab>({
                    bundleId: this.gameId.toString(),
                    path: path,
                    pathForDevMode: devPath,
                    type: cc.Prefab
                });

                this[dict[key]] = prefab;
            } catch (e) {
                console.warn(`Missing prefab for ${path} `, e);
            }
        }
    }

    loadAudios() {
        const dict = {
            [SlotGameSound.SPIN]: "spin-button",
            [SlotGameSound.WIN]: "win",
            [SlotGameSound.BIG_WIN]: "big-win",
            [SlotGameSound.JACKPOT]: "jackpot",
            [SlotGameSound.FREESPIN]: "freespin",
            [SlotGameSound.BONUS]: "bonus",
            [SlotGameSound.SPINNING_NORMAL]: "spinning-normal",
            [SlotGameSound.SPINNING_TURBO]: "spinning-turbo"
        };

        for (const key of Object.keys(dict)) {
            const path = `preload/audios/${dict[key]}`;
            const devPath = `../games/*/${path}`;
            BundleManager.getInstance()
                .loadAsset<cc.AudioClip>({
                    bundleId: this.gameId.toString(),
                    path: path,
                    pathForDevMode: devPath,
                    type: cc.AudioClip
                })
                .then((clip) => {
                    if (clip) {
                        this.audioClips[key] = clip;
                    }
                })
                .catch(() => {
                    console.warn("missing audio for", path);
                });
        }
    }

    override playSound(type: SlotGameSound) {
        const key = type.toString();
        if (this.audioClips[key]) {
            AudioManager.getInstance().playSFX(this.audioClips[key]);
        }
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new StandardSlotGameConfigs();
    }

    initSlotBoard() {
        this.loadSlotSymbols().then(() => {
            super.initSlotBoard();

            this.slotBoard.onSymbolPreview = this.onSymbolPreview.bind(this);
        });
    }

    onSymbolPreview(symbol: number, worldPosition: cc.Vec3, isInfoOnLeft: boolean) {
        if (!this.gameConfigs?.odds) {
            return;
        }
        const prefabCache = GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId];
        const prefab = prefabCache[symbol];
        const node = cc.instantiate(prefab);

        const previewPrefab = isInfoOnLeft ? this.previewSymbolLeft : this.previewSymbolRight;
        const previewNode = cc.instantiate(previewPrefab);

        const symbolPreview = previewNode.getComponent(SymbolPreview);
        symbolPreview.setInfo({
            node,
            odds: this.gameConfigs.odds[symbol]
        });
        this.slotBoard.showPreview(previewNode, worldPosition);
    }

    async loadSlotSymbols() {
        const prefabCache = GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId] || {};
        for (let index = 0; index < this.slotGameConfigs.itemTypeCount; index++) {
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
