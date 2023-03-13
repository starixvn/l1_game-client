import { BundleManager } from "bundle-management";

import GameUIManager from "../../../lobby/main/view-models/GameUIManager";
import CascadingSlotBase from "./CascadingSlotBase";
import { CascadingSlotConfig } from "./CascadingSlotBaseConfig";
import { CascadingSlotGameSound } from "./CascadingSlotGameSound";
import FreeSpinView from "./FreeSpinView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardCascadingSlotGame extends CascadingSlotBase {
    @property({ type: cc.Prefab, visible: false, override: true })
    flyWinLabelPrefab: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    effectBigWin: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    effectFreeSpin: cc.Prefab = null;

    @property({ type: cc.AudioSource, visible: false, override: true })
    soundSources: cc.AudioSource[] = [];

    @property({ type: cc.Toggle, visible: false, override: true })
    autoSpinToggle: cc.Toggle = null;

    @property({ type: cc.Toggle, visible: false, override: true })
    turboToggle: cc.Toggle = null;

    @property(cc.Node)
    bottomMessageArea: cc.Node = null;

    @property(cc.Node)
    bottomArea: cc.Node = null;

    @property(cc.Node)
    tumbleWinFrameNode: cc.Node = null;

    @property(cc.Node)
    totalMultiplierViewNode: cc.Node = null;

    @property(cc.Node)
    tumbleListNode: cc.Node = null;

    @property(cc.Node)
    freespinViewNode: cc.Node = null;

    @property
    bottomAreaTextColor = "#ffffff";

    @property
    bottomAreaNumberColor = "#ffffff";

    @property
    bottomAreaButtonBorderColor = "#ffffff";

    @property
    previewOddsBorderColor = "#ffffff";

    @property
    previewOddsSymbolNumberColor = "#ffffff";

    @property
    previewOddsWinValueColor = "#ffffff";

    @property
    noticeTextColor = "#ffffff";

    @property
    noticeHighlightTextColor = "#ffffff";

    @property
    bonusCountItemTextColor = "#ffffff";

    @property
    protected _gameId = 0;
    @property
    public get gameId(): number {
        return this._gameId;
    }
    public set gameId(value) {
        this._gameId = value;
    }

    slotBottomAreaPrefab: cc.Prefab;
    bottomMessagePrefab: cc.Prefab;
    freespinViewPrefab: cc.Prefab;
    tumbleListPrefab: cc.Prefab;
    totalMultiplierPrefab: cc.Prefab;
    tumbleWinFramePrefab: cc.Prefab;

    onLoad() {
        super.onLoad();
        this.loadAudios();
    }

    onLoadedPrefabs() {
        this.initPrefabGame(this.totalMultiplierPrefab, this.totalMultiplierViewNode);
        this.initPrefabGame(this.tumbleListPrefab, this.tumbleListNode);
        this.initFreespinView();
        this.initTumbleList();
        super.onLoadedPrefabs();
    }

    async loadPrefabsByCode() {
        const dict = {
            // prefab name : prefab property
            "free-spin-view": "freespinViewPrefab",
            "effect-big-win": "effectBigWin",
            "effect-freespin": "effectFreeSpin",
            "total-multiplier-frame": "totalMultiplierPrefab",

            "tumble-win-frame": "tumbleWinFramePrefab",
            "tumble-list": "tumbleListPrefab"
            // "bottom-message": "bottomMessage"
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

    async loadSlotSymbols() {
        const prefabCache = GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId] || {};
        for (let index = 0; index < CascadingSlotConfig.itemTypeCount; index++) {
            if (prefabCache[index]) {
                continue;
            }
            const path = `preload/symbol-spines/symbol-${index}`;
            const devPath = `../games/*/${path}`;
            const data = await BundleManager.getInstance().loadAsset<sp.SkeletonData>({
                bundleId: this.gameId.toString(),
                path: path,
                pathForDevMode: devPath,
                type: sp.SkeletonData
            });

            prefabCache[index] = data;
        }

        GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId] = prefabCache;
    }

    loadAudios() {
        const dict = {
            [CascadingSlotGameSound.SPIN_BUTTON]: "spin-button",
            [CascadingSlotGameSound.FALL_OUT]: "fall_out",
            [CascadingSlotGameSound.DROP_IN]: "drop_in",
            [CascadingSlotGameSound.MULTIPLIER_APPEAR]: "multiplier_appear",
            [CascadingSlotGameSound.BIG_WIN]: "big_win",
            [CascadingSlotGameSound.BIG_WIN_STOP]: "big_win_end",
            [CascadingSlotGameSound.FREE_SPIN]: "free_spin",
            [CascadingSlotGameSound.TURBO_FALL_OUT]: "turbo_fall_out",

            [CascadingSlotGameSound.TURBO_DROP_IN]: "turbo_drop_in",
            [CascadingSlotGameSound.REEL_STOP]: "reel_stop0",
            [CascadingSlotGameSound.REEL_STOP_1]: "reel_stop1",
            [CascadingSlotGameSound.REEL_STOP_2]: "reel_stop2",

            [CascadingSlotGameSound.REEL_STOP_3]: "reel_stop3",
            [CascadingSlotGameSound.REEL_STOP_4]: "reel_stop4",
            [CascadingSlotGameSound.REEL_STOP_5]: "reel_stop5",
            [CascadingSlotGameSound.SYMBOL_EXPLODE]: "explode",
            [CascadingSlotGameSound.INCREMENT]: "increment",
            [CascadingSlotGameSound.INCREMENT_STOP]: "increment_stop",
            [CascadingSlotGameSound.REELHAVEMULTIPLIER]: "special_symbol_land",
            [CascadingSlotGameSound.COIN]: "coin"
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
                        this.gameSound.soundSources[key] = clip;
                    }
                })
                .catch(() => {
                    console.warn("missing audio for", path);
                });
        }
    }

    initPrefabGame(prefab: cc.Prefab, node: cc.Node) {
        const nodeTmp = cc.instantiate(prefab);
        node.addChild(nodeTmp);
    }

    initFreespinView() {
        const node = cc.instantiate(this.freespinViewPrefab);
        this.freespinViewNode.addChild(node);
        this.freeSpinView = node.getComponent(FreeSpinView);
        this.freeSpinView.showViewQuickly(false);
    }

    initTumbleList() {
        const node = cc.instantiate(this.tumbleListPrefab);
        this.tumbleListNode.addChild(node);
    }
}
