import { BundleManager } from "bundle-management";
import * as _ from "lodash";

import AudioManager from "../../common/audio/AudioManager";
import CallbackAnimation from "../../common/CallbackAnimation";
import LocalizedLoadSprite from "../../common/i18n/LocalizedLoadSprite";
import GameUIManager from "../../lobby/main/view-models/GameUIManager";
import SlotBottomArea from "./SlotBottomArea";
import SlotGameBase, { SlotGameSound } from "./SlotGameBase";
import { SlotNotification } from "./SlotGameBottomMessage";
import StandardSlotBoard from "./StandardSlotBoard";
import { StandardSlotGameConfigs } from "./StandardSlotGameConfigs";
import StandardSlotGameHistory from "./StandardSlotGameHistory";
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
    autoSpinDialogPrefab: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    historyPrefab: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    guidePrefab: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    linePrefab: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    lightLinePrefab: cc.Prefab = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    miniNoticePrefab: cc.Prefab = null;

    @property({ type: cc.AudioSource, visible: false, override: true })
    soundSources: cc.AudioSource[] = [];

    @property({ type: cc.Toggle, visible: false, override: true })
    autoSpinToggle: cc.Toggle = null;

    @property({ type: cc.Toggle, visible: false, override: true })
    turboToggle: cc.Toggle = null;

    @property({ type: cc.Button, visible: false, override: true })
    stakeButton: cc.Button = null;

    @property({ type: cc.ToggleContainer, visible: false, override: true })
    stakeContainer: cc.ToggleContainer = null;

    @property({ type: cc.Button, visible: false, override: true })
    lineButton: cc.Button = null;

    @property({ type: cc.Label, visible: false, override: true })
    stakeLabel: cc.Label = null;

    @property({ type: cc.Label, visible: false, override: true })
    lineLabel: cc.Label = null;

    @property({ type: cc.Label, visible: false, override: true })
    totalBet: cc.Label = null;

    @property({ type: cc.Label, visible: false, override: true })
    winningBet: cc.Label = null;

    @property({ type: cc.Node, visible: false, override: true })
    winningBetEffect: cc.Node = null;

    @property(cc.Node)
    bottomMessageArea: cc.Node = null;

    @property(cc.Node)
    bottomArea: cc.Node = null;

    @property
    bottomAreaTextColor = "#ffffff";

    @property
    bottomAreaButtonBorderColor = "#ffffff";

    @property
    previewOddsSymbolNumberColor = "#ffffff";

    @property
    previewOddsWinValueColor = "#ffffff";

    @property
    miniWarningTextColor = "#ffffff";

    @property
    miniWarningOutlineColor = "#ffffff";

    @property
    protected _gameId = 0;
    @property
    public get gameId(): number {
        return this._gameId;
    }
    public set gameId(value) {
        this._gameId = value;
    }

    public delayShowBigWinValue = 1;
    normalPaylineDuration = 2;
    turboPaylineDuration = 1;

    protected audioClips = {};
    private previewSymbolLeft: cc.Prefab;
    private previewSymbolRight: cc.Prefab;
    private effectTransitionPrefab: cc.Prefab;
    slotBoard: StandardSlotBoard;
    slotBottomAreaPrefab: cc.Prefab;
    bottomMessagePrefab: cc.Prefab;

    onLoad() {
        this.loadAudios();
        super.onLoad();
        this.loadSpritesWithGameId();
    }

    loadSpritesWithGameId() {
        this.node.getComponentsInChildren(LocalizedLoadSprite).forEach((comp) => {
            comp.gameId = this.gameId;
        });
    }

    async loadCommonPrefabsByCode() {
        const dict = {
            // prefab name : prefab property
            "slot-bottom-area": "slotBottomAreaPrefab",
            "bottom-message": "bottomMessagePrefab",
            "dialog-line-selection": "lineSelectionDialog",
            "dialog-auto-spin": "autoSpinDialogPrefab",
            "dialog-history": "historyPrefab",
            "dialog-guide": "guidePrefab"
        };

        for (const key of Object.keys(dict)) {
            const path = `shared/slot-game/${key}`;
            try {
                const prefab = await new Promise<cc.Prefab>((resolve, reject) => {
                    cc.resources.load<cc.Prefab>(path, cc.Prefab, (error, prefab) => {
                        if (error || !prefab) {
                            reject(error);
                        } else {
                            resolve(prefab);
                        }
                    });
                });
                this[dict[key]] = prefab;
            } catch (e) {
                console.warn(`Missing prefab for ${path} `, e);
            }
        }
    }

    async loadPrefabsByCode() {
        const dict = {
            // prefab name : prefab property
            "effect-transition": "effectTransitionPrefab",
            "mini-warning": "miniNoticePrefab",
            "top-winner": "topWinnerPrefab",
            "effect-jackpot": "effectJackpot",

            "effect-bonus": "effectBonus",
            "effect-big-win": "effectBigWin",
            "effect-freespin": "effectFreeSpin",

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

    setTotalFreeSpins(value: number) {
        super.setTotalFreeSpins(value);
        this.bottomMessage && this.bottomMessage.showMessages(SlotNotification.FREESPINS);
    }
    updateBottomMessageStatus() {
        super.updateBottomMessageStatus();
        this.bottomMessage && (this.bottomMessage.isFreeSpin = this.isFreeSpin());
    }

    override playSound(type: SlotGameSound) {
        const key = type.toString();
        if (this.audioClips[key]) {
            AudioManager.getInstance().playSFX(this.audioClips[key]);
        }
    }

    protected override onStakeChanged() {
        super.onStakeChanged();
        if (!this.stakeButton || !this.gameConfigs) {
            return;
        }
        const decreaseBtn = this.stakeButton.node.getChildByName("decrease").getComponent(cc.Button);
        const increaseBtn = this.stakeButton.node.getChildByName("increase").getComponent(cc.Button);
        const index = this.gameConfigs.stakeLevels.findIndex((stake) => stake === this.stake);
        decreaseBtn.interactable = index > 0;
        increaseBtn.interactable = index < this.gameConfigs.stakeLevels.length - 1;
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new StandardSlotGameConfigs();
    }

    initSlotBoard() {
        this.loadSlotSymbols().then(() => {
            super.initSlotBoard();
            this.slotBoard.onSymbolPreview = this.onSymbolPreview.bind(this);
            this.loadWinningSymbolAnimation().then(() => {
                this.slotBoard.setItemWinningEffect();
            });
        });
    }

    onSymbolPreview(symbol: number, worldPosition: cc.Vec3, isInfoOnLeft: boolean) {
        if (!this.gameConfigs?.odds) {
            return;
        }
        const symbolCache = GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId];
        const spine = symbolCache[symbol];

        const previewPrefab = isInfoOnLeft ? this.previewSymbolLeft : this.previewSymbolRight;
        const previewNode = cc.instantiate(previewPrefab);

        const symbolPreview = previewNode.getComponent(SymbolPreview);
        symbolPreview.setInfo({
            spine,
            odds: this.gameConfigs.odds[symbol],
            colorList: [this.previewOddsSymbolNumberColor, this.previewOddsWinValueColor]
        });
        this.slotBoard.showPreview(previewNode, worldPosition);
    }

    async loadSlotSymbols() {
        const prefabCache = GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId] || {};
        for (let index = 0; index < this.slotGameConfigs.itemTypeCount; index++) {
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

    async loadWinningSymbolAnimation() {
        const prefabCache = GameUIManager.getInstance().prefabCache.slotWinningAnimation[this.gameId] || {};

        if (prefabCache !== null) {
            const path = `preload/symbol-spines/winning-animation`;
            const devPath = `../games/*/${path}`;
            const data = await BundleManager.getInstance().loadAsset<sp.SkeletonData>({
                bundleId: this.gameId.toString(),
                path: path,
                pathForDevMode: devPath,
                type: sp.SkeletonData
            });

            GameUIManager.getInstance().prefabCache.slotWinningAnimation[this.gameId] = data;
        }
    }

    initBottomArea() {
        if (!this.slotBottomAreaPrefab) {
            return;
        }

        const slotBottom = cc.instantiate(this.slotBottomAreaPrefab);
        this.bottomArea.addChild(slotBottom);
        const slotBottomArea = slotBottom.getComponent(SlotBottomArea);
        slotBottomArea.updateColor(this.bottomAreaTextColor, this.bottomAreaButtonBorderColor);

        if (slotBottomArea) {
            this.autoSpinToggle = slotBottomArea.autoSpinToggle;
            this.turboToggle = slotBottomArea.turboToggle;
            this.stakeButton = slotBottomArea.stakeButton;
            this.stakeContainer = slotBottomArea.stakeContainer;
            this.lineButton = slotBottomArea.lineButton;
            this.stakeLabel = slotBottomArea.stakeLabel;
            this.lineLabel = slotBottomArea.lineLabel;
            this.totalBet = slotBottomArea.totalBet;
            this.winningBet = slotBottomArea.winningBet;
            this.winningBetEffect = slotBottomArea.winningBetEffect;

            slotBottomArea.onClickListener = {
                onStakeButtonClick: () => {
                    this.onStakeButtonClick();
                },
                onLineSelectionClick: () => {
                    this.onLineSelectionClick();
                },
                onAutoSpinChanged: () => {
                    this.onAutoSpinChanged();
                },
                onHideStakeContainer: () => {
                    this.hideStakeContrainer();
                },
                onTurboModeChanged: (toggle) => {
                    this.onTurboModeChanged(toggle);
                },
                onStakeQuickChange: (event) => {
                    this.onStakeQuickChange(event);
                },
                onStakeToggleChanged: (event, param) => {
                    this.onStakeToggleChanged(event, param);
                }
            };

            this.loadStakeLevelsConfig();
        }
    }

    initBottomMessage() {
        const node = cc.instantiate(this.bottomMessagePrefab);
        this.bottomMessageArea.addChild(node);
        this.initShowBottomMessage(node);

        if (this.totalFreeSpins) {
            this.setTotalFreeSpins(this.totalFreeSpins);
        }
    }

    generateRandomBoardData() {
        const samples = [
            [8, 9, 6, 1, 3, 1, 7, 2, 0, 6, 4, 5, 10, 10, 7],
            [1, 1, 3, 7, 6, 4, 10, 8, 9, 3, 1, 0, 2, 10, 5],
            [10, 2, 0, 7, 4, 6, 9, 8, 0, 5, 3, 7, 1, 5, 9],
            [3, 10, 0, 8, 5, 9, 9, 1, 7, 6, 10, 2, 4, 3, 3],
            [9, 7, 5, 4, 6, 5, 10, 3, 1, 9, 8, 6, 2, 0, 8]
        ];
        const data = samples[_.random(samples.length - 1)];
        console.log(data);
        return data;
    }

    onClickShowHistory() {
        super.onClickShowHistory();
        const history = this.historyComponent as StandardSlotGameHistory;
        history.gameId = this.gameId;
    }

    hideWinningEffectOnItems() {
        super.hideWinningEffectOnItems();
        this.slotBoard.updateSymbolDuration(this.getWinningPaylineDuration());
    }

    updateMiniWarningContent(miniWarningComp, data: string) {
        const text = miniWarningComp.text;
        text.string = data.toUpperCase();

        // update style
        text.node.color = cc.Color.WHITE.fromHEX(this.miniWarningTextColor);
        const outLine = text.node.getComponent(cc.LabelOutline);
        outLine && (outLine.color = cc.Color.WHITE.fromHEX(this.miniWarningOutlineColor));
    }

    async showEffectFreeSpin() {
        const transtition = await this.playEffectTransition();
        super.showEffectFreeSpin();
        transtition?.destroy();
    }

    async showEffectBigWin(betWin: number) {
        const transtition = await this.playEffectTransition();
        await super.showEffectBigWin(betWin);
        transtition?.destroy();
    }

    async showEffectBonus(bonus: number): Promise<void> {
        const transtition = await this.playEffectTransition();
        await super.showEffectBonus(bonus);
        transtition?.destroy();
    }

    protected async playEffectTransition() {
        if (!this.effectTransitionPrefab) {
            return null;
        }
        const effect = cc.instantiate(this.effectTransitionPrefab);
        const animation = effect.getComponent(CallbackAnimation);
        animation.autoDestroyNode = false;
        await this.showEffect(effect);
        return effect;
    }
}
