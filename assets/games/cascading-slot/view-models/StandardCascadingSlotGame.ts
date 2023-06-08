import { BundleManager } from "bundle-management";

import AudioManager from "../../../common/audio/AudioManager";
import { uiManager } from "../../../managers/GameUIManager";
import CascadingUIModel from "../models/CascadingUIModel";
import CascadingSlotBase from "./CascadingSlotBase";
import { CascadingSlotConfig } from "./CascadingSlotBaseConfig";
import { CascadingSlotGameSound } from "./CascadingSlotGameSound";
import CascadingSlotTumbleList from "./CascadingSlotTumbleList";
import CascadingSymbolPreview from "./CascadingSymbolPreview";
import StandardCascadingBottomArea from "./StandardCascadingBottomArea";
import StandardCascadingSlotBoard from "./StandardCascadingSlotBoard";
import TotalMultiplierView from "./TotalMultiplierView";
import TumbleWinView from "./TumbleWinView";
import StandardCascadingSlotReelItem from "./StandardCascadingSlotReelItem";
import ChangeNodeColor from "../../../common/ChangeNodeColor";
import BigWinAnimation from "../../_slotgame_base/BigWinAnimation";
import CallbackLoopAnimation from "../../../common/CallbackLoopAnimation";

const { ccclass, property } = cc._decorator;
const LocalizedLabel = require("LocalizedLabel");

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
        //this.initFreespinView();
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
        const prefabCache = uiManager.prefabCache.slotSymbols[this.gameId] || {};
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

        uiManager.prefabCache.slotSymbols[this.gameId] = prefabCache;
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
            [CascadingSlotGameSound.COIN]: "coin",
            [CascadingSlotGameSound.CLICK]: "click"
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

    onSymbolPreview(symbol: StandardCascadingSlotReelItem, worldPosition: cc.Vec3, isInfoOnLeft: boolean) {
        if (!this.gameConfigs?.odds || !this.isFinishedRound) {
            return;
        }
        this.playSound(CascadingSlotGameSound.CLICK);
        const symbolCache = uiManager.prefabCache.slotSymbols[this.gameId];
        const spine = symbolCache[symbol.index];

        const previewPrefab = isInfoOnLeft ? this.previewSymbolLeft : this.previewSymbolRight;
        const previewNode = cc.instantiate(previewPrefab);

        const symbolPreview = previewNode.getComponent(CascadingSymbolPreview);
        this.board.showPreview(previewNode, worldPosition);
        symbolPreview.setInfo({
            spine,
            odds: this.gameConfigs.odds.symbols[symbol.index],
            colorList: [this.colorConfig.previewOddsSymbolNumberColor, this.colorConfig.previewOddsWinValueColor],
            borderColor: this.colorConfig.previewOddsBorderColor,
            coinValue: this.currCoinValue,
            betLevel: this.currBetLevel,
            freespin: this.gameConfigs.odds.freeSpins.initialOdds,
            symbolItem: symbol
        });
    }

    playSound(type: CascadingSlotGameSound, loop = false): number {
        if (this.audioClips[type]) {
            return AudioManager.getInstance().playSFX(this.audioClips[type], loop);
        }
    }

    stopSoundSFX(audioId: number) {
        AudioManager.getInstance().stopSFX(audioId);
    }

    initPrefabGame(prefab: cc.Prefab, node: cc.Node) {
        const nodeTmp = cc.instantiate(prefab);
        node.addChild(nodeTmp);
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
        this.updateColor(
            {
                textColor: this.colorConfig.bottomAreaTextColor,
                numberColor: this.colorConfig.bottomAreaNumberColor,
                buttonBorderColor: this.colorConfig.bottomAreaButtonBorderColor
            },
            bottomArea.node
        );
        this.betControl = bottomArea.betControl;
        this.updateColor(
            {
                textColor: this.colorConfig.bottomAreaTextColor,
                numberColor: this.colorConfig.bottomAreaNumberColor,
                buttonBorderColor: this.colorConfig.bottomAreaButtonBorderColor
            },
            this.betControl.node
        );
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

    updateColor(colorList, node: cc.Node) {
        const { textColor, numberColor, buttonBorderColor } = colorList;

        node.getComponentsInChildren(ChangeNodeColor).forEach((comp) => {
            const labelComp = comp.node.getComponent(cc.Label);
            if (labelComp) {
                comp.updateColor(comp.node.getComponent(LocalizedLabel) ? textColor : numberColor);
            } else {
                comp.updateColor(buttonBorderColor);
            }
        });
    }

    clickOutsideReelArea() {
        super.clickOutsideReelArea();
        this.inGameMenu.expandableMenu.collapseMenu();
    }

    initGameDataEvents() {
        super.initGameDataEvents();
        this.gameData.uiModel.on(CascadingUIModel.Events.SET_FREESPINS, (value: number) => {
            this.totalFreeSpins = value;
            this.bottomMessage.freeSpinCount = this.totalFreeSpins;
        });
    }

    flyWinLabelAnimation(node: cc.Node) {
        node.scale = 0.9;
        node.opacity = 255;
        cc.tween(node)
            .parallel(cc.tween().to(0.1, { scale: 1.3 }), cc.tween().by(0.1, { y: 15 }, { easing: "sineOut" }))
            .parallel(
                cc.tween().to(0.5, { scale: 1 }, { easing: "sineOut" }).to(0.5, { opacity: 0, scale: 0.9 }, { easing: "sineOut" }),
                cc.tween().by(0.5, { y: 25 }, { easing: "sineOut" }).by(0.5, { y: 10 }, { easing: "sineOut" })
            )
            .call(() => {
                node.destroy();
            })
            .start();
    }

    protected soundEndForBigWinStandard(bigWinAudioId: number, incrementAudioId: number) {
        this.playSound(CascadingSlotGameSound.BIG_WIN_STOP);
        this.playSound(CascadingSlotGameSound.INCREMENT_STOP);
        this.stopSoundSFX(bigWinAudioId);
        this.stopSoundSFX(incrementAudioId);
    }

    override async showEffectBigWin(betWin: number) {
        const bigWinAudioId = this.playSound(CascadingSlotGameSound.BIG_WIN, true);
        const incrementAudioId = this.playSound(CascadingSlotGameSound.INCREMENT, true);

        const effect = cc.instantiate(this.effectBigWin);
        const callbackAnim = effect.getComponent(CallbackLoopAnimation);
        callbackAnim.setDuration(this.getCustomDuration("bigWin"));
        const bigWinAnimation = effect.getComponent(BigWinAnimation);

        if (this.isTurboMode()) {
            this.soundEndForBigWinStandard(bigWinAudioId, incrementAudioId);
            bigWinAnimation.setAmount({ amount: betWin });
            callbackAnim.skipTouchToContinue();
        } else {
            bigWinAnimation
                .setAmountSlowHavingSpeed(betWin, () => {
                    this.soundEndForBigWinStandard(bigWinAudioId, incrementAudioId);
                    callbackAnim.closeLater();
                })
                .catch((reason) => console.log(reason));
        }

        callbackAnim.skipCallback = () => {
            this.soundEndForBigWinStandard(bigWinAudioId, incrementAudioId);
            bigWinAnimation.setAmount({ amount: betWin });
        };

        await this.showEffect(effect);
    }
}
