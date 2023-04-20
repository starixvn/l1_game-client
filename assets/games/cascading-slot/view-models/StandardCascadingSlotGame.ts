import { BundleManager } from "bundle-management";

import AudioManager from "../../../common/audio/AudioManager";
import GameUIManager from "../../../lobby/main/view-models/GameUIManager";
import CascadingSlotBase from "./CascadingSlotBase";
import { CascadingSlotConfig } from "./CascadingSlotBaseConfig";
import { CascadingSlotGameSound } from "./CascadingSlotGameSound";
import CascadingSlotTumbleList from "./CascadingSlotTumbleList";
import CascadingSymbolPreview from "./CascadingSymbolPreview";
import FreeSpinView from "./FreeSpinView";
import StandardCascadingBottomArea from "./StandardCascadingBottomArea";
import StandardCascadingSlotBoard from "./StandardCascadingSlotBoard";
import TotalMultiplierView from "./TotalMultiplierView";
import TumbleWinView from "./TumbleWinView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardCascadingSlotGame extends CascadingSlotBase {
    @property({ type: cc.Prefab, visible: false, override: true })
    effectBigWin: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    effectFreeSpin: cc.Prefab = null;

    @property({ type: cc.Toggle, visible: false, override: true })
    autoSpinToggle: cc.Toggle = null;

    @property({ type: cc.Toggle, visible: false, override: true })
    turboToggle: cc.Toggle = null;

    @property({ type: cc.Label, visible: false, override: true })
    totalWinLabel: cc.Label = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    betControlPrefab: cc.Prefab = null;

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

    @property(cc.JsonAsset)
    musicInfo: cc.JsonAsset = null;

    @property(cc.JsonAsset)
    colorInfo: cc.JsonAsset = null;

    @property
    protected _gameId = 0;
    @property
    public get gameId(): number {
        return this._gameId;
    }
    public set gameId(value) {
        this._gameId = value;
    }

    bottomMessagePrefab: cc.Prefab;
    freespinViewPrefab: cc.Prefab;
    tumbleListPrefab: cc.Prefab;
    totalMultiplierPrefab: cc.Prefab;
    tumbleWinFramePrefab: cc.Prefab;
    board: StandardCascadingSlotBoard;
    private readonly previewSymbolLeft: cc.Prefab;
    private readonly previewSymbolRight: cc.Prefab;
    private colorConfig: any;

    audioClips = {};

    onLoad() {
        this.initColorConfig();
        super.onLoad();
        this.loadAudios();
    }

    protected initColorConfig() {
        this.colorConfig = this.colorInfo.json;
    }

    onLoadedPrefabs() {
        this.initTumbleWinFrame();
        this.initFreespinView();
        this.initTumbleWinList();
        this.initTotalMultiplierFrame();

        this.loadSlotSymbols().then(() => {
            super.onLoadedPrefabs();
            this.board.previewPopup.onSymbolPreview = this.onSymbolPreview.bind(this);
        });

        this.callRegisterGame();
    }

    onEnable(): void {
        //overide empty
    }

    async loadPrefabsByCode() {
        const dict = {
            // prefab name : prefab property
            "free-spin-view": "freespinViewPrefab",
            "effect-big-win": "effectBigWin",
            "effect-freespin": "effectFreeSpin",
            "total-multiplier-frame": "totalMultiplierPrefab",

            "tumble-win-frame": "tumbleWinFramePrefab",
            "tumble-list": "tumbleListPrefab",

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
            [CascadingSlotGameSound.FALL_OUT]: "symbol-out",
            [CascadingSlotGameSound.DROP_IN]: "symbol-in",
            [CascadingSlotGameSound.MULTIPLIER_APPEAR]: "multiplier-appear",
            [CascadingSlotGameSound.BIG_WIN]: "big-win",
            [CascadingSlotGameSound.BIG_WIN_STOP]: "big-win-increment-ended",
            [CascadingSlotGameSound.FREE_SPIN]: "freespin",
            [CascadingSlotGameSound.TURBO_FALL_OUT]: "symbol-in-out-turbo",

            [CascadingSlotGameSound.TURBO_DROP_IN]: "symbol-in-out-turbo",
            [CascadingSlotGameSound.REEL_STOP]: "reelstop1",
            [CascadingSlotGameSound.REEL_STOP_1]: "reelstop2",
            [CascadingSlotGameSound.REEL_STOP_2]: "reelstop3",

            [CascadingSlotGameSound.REEL_STOP_3]: "reelstop4",
            [CascadingSlotGameSound.REEL_STOP_4]: "reelstop5",
            [CascadingSlotGameSound.REEL_STOP_5]: "reelstop5",
            [CascadingSlotGameSound.SYMBOL_EXPLODE]: "symbol-match",
            [CascadingSlotGameSound.INCREMENT]: "increment",
            [CascadingSlotGameSound.INCREMENT_STOP]: "increment-stop",
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
                        this.audioClips[key] = clip;
                    }
                })
                .catch(() => {
                    console.warn("missing audio for", path);
                });
        }
    }

    onSymbolPreview(symbol: number, worldPosition: cc.Vec3, isInfoOnLeft: boolean) {
        if (!this.gameConfigs?.odds) {
            return;
        }
        this.playSound(CascadingSlotGameSound.CLICK);
        const symbolCache = GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId];
        const spine = symbolCache[symbol];

        const previewPrefab = isInfoOnLeft ? this.previewSymbolLeft : this.previewSymbolRight;
        const previewNode = cc.instantiate(previewPrefab);

        const symbolPreview = previewNode.getComponent(CascadingSymbolPreview);
        symbolPreview.setInfo({
            spine,
            odds: this.gameConfigs.odds.symbols[symbol],
            colorList: [this.colorConfig.previewOddsSymbolNumberColor, this.colorConfig.previewOddsWinValueColor],
            borderColor: this.colorConfig.previewOddsBorderColor,
            coinValue: this.currCoinValue,
            betLevel: this.currBetLevel,
            freespin: this.gameConfigs.odds.freeSpins.initialOdds,
            symbol
        });
        this.board.showPreview(previewNode, worldPosition);
    }

    playSound(type: CascadingSlotGameSound) {
        this.audioClips[type] && AudioManager.getInstance().playSFX(this.audioClips[type]);
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

    initTumbleWinList() {
        const node = cc.instantiate(this.tumbleListPrefab);
        this.tumbleListNode.addChild(node);
        this.tumbleList = node.getComponent(CascadingSlotTumbleList);
    }

    initTumbleWinFrame() {
        const node = cc.instantiate(this.tumbleWinFramePrefab);
        this.tumbleWinFrameNode.addChild(node);
        this.tumbleWinView = node.getComponent(TumbleWinView);
    }

    initTotalMultiplierFrame() {
        const node = cc.instantiate(this.totalMultiplierPrefab);
        this.totalMultiplierViewNode.addChild(node);
        this.totalMultiplierView = node.getComponent(TotalMultiplierView);
    }

    initBottomArea(node: cc.Node) {
        const bottomArea = node.getComponent(StandardCascadingBottomArea);
        this.betControl = bottomArea.betControl;
        this.miniBetControl = bottomArea.miniBetControl;
        this.checkExistNodeBet();
        this.autoSpinToggle = bottomArea.autoSpinToggle;
        this.turboToggle = bottomArea.turboToggle;
        this.totalWinLabel = bottomArea.totalWinLabel;
        bottomArea.onClickListener = {
            onAutoSpinChanged: () => {
                this.onAutoSpinChanged();
            },
            onTurboModeChanged: (toggle) => {
                this.onTurboModeChanged(toggle);
            }
        };
    }

    clickOutsideReelArea() {
        this.inGameMenu.expandableMenu.collapseMenu();
        GameUIManager.getInstance().emitter.emit(GameUIManager.Events.CLICK_OUTSIDE_REEL_AREA);
    }
}
