import * as _ from "lodash";

import AudioManager from "../../common/audio/AudioManager";
import MusicPlayer from "../../common/audio/MusicPlayer";
import CallbackAnimation from "../../common/CallbackAnimation";
import ExpandableMenu from "../../common/expandable-menu/view-models/ExpandableMenu";
import GameUtils from "../../common/GameUtils";
import { numberWithCommas } from "../../common/helpers/NumberHelper";
import HoverItemBase from "../../common/HoverItemBase";
import JackpotPoolInfoBase from "../../lobby/main/view-models/JackpotPoolInfoBase";
import { GameState } from "../_base/GameState";
import LineView from "../AHCL/scripts/LineView";
import { FourGuardiansSlotConfigs } from "../four-guardians/scripts/FourGuardiansSlotConfigs";
import AutoSpinSettingDialog from "./AutoSpinSettingDialog";
import BigWinAnimation from "./BigWinAnimation";
import BonusDialog from "./BonusDialog";
import FeatureSlotGameBase from "./FeatureSlotGameBase";
import SlotGameBaseNoticeHandler from "./handlers/SlotGameBaseNoticeHandler";
import SlotGameBetHandler from "./handlers/SlotGameBetHandler";
import SlotGameBonusHandler from "./handlers/SlotGameBonusHandler";
import SlotGameIngameHandler from "./handlers/SlotGameIngameHandler";
import SlotGameJackpotHandler from "./handlers/SlotGameJackpotHandler";
import SlotGameSettlementHandler from "./handlers/SlotGameSettlementHandler";
import LineSelectionDialog from "./LineSelectionDialog";
import SlotBoard from "./SlotBoard";
import { SlotGameBaseConfigs } from "./SlotGameBaseConfigs";
import SlotGameHistory from "./SlotGameHistory";
import SlotGameTopWinner from "./SlotGameTopWinner";
import SlotGameUserSettings from "./SlotGameUserSettings";
import TurboAutoSpinSettingDialog from "./TurboAutoSpinSettingDialog";
import { RoundType } from "./SlotGameBottomMessage";

export interface LineData {
    payline: number;
    positions: number[];
    symbol: number;
}

enum SlotGameSound {
    SPIN = 0,
    WIN = 1,
    BIG_WIN = 2,
    JACKPOT = 3,
    FREESPIN = 4,
    BONUS = 5
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameBase extends FeatureSlotGameBase {
    @property(SlotBoard)
    slotBoard: SlotBoard = null;

    @property(HoverItemBase)
    leftNumberContainer: HoverItemBase = null;

    @property(HoverItemBase)
    rightNumberContainer: HoverItemBase = null;

    @property(cc.Node)
    lineContainer: cc.Node = null;

    @property(cc.Node)
    winningNode: cc.Node = null;

    @property(cc.Button)
    stakeButton: cc.Button = null;

    @property(cc.ToggleContainer)
    stakeContainer: cc.ToggleContainer = null;

    @property(cc.Button)
    lineButton: cc.Button = null;

    @property(cc.Label)
    stakeLabel: cc.Label = null;

    @property(cc.Label)
    jackpotPoolLabel: cc.Label = null;

    @property(cc.Label)
    lineLabel: cc.Label = null;

    @property(cc.Label)
    totalBet: cc.Label = null;

    @property(cc.Label)
    winningBet: cc.Label = null;

    @property(cc.Node)
    winningBetEffect: cc.Node = null;

    @property(cc.Prefab)
    lineSelectionDialog: cc.Prefab = null;

    @property(cc.Prefab)
    bonusDialog: cc.Prefab = null;

    @property(ExpandableMenu)
    expandableMenu: ExpandableMenu = null;

    @property(cc.Prefab)
    topWinnerPrefab: cc.Node = null;

    @property(cc.Prefab)
    effectBonus: cc.Prefab = null;

    @property(cc.Prefab)
    effectJackpot: cc.Prefab = null;

    @property(JackpotPoolInfoBase)
    jackpotPoolInfo: JackpotPoolInfoBase = null;

    @property({ type: cc.AudioSource })
    soundSources: cc.AudioSource[] = [];

    @property
    autoGenerateLines = false;

    @property({
        type: cc.Prefab,
        visible: function (this: SlotGameBase) {
            return this.autoGenerateLines;
        }
    })
    linePrefab: cc.Prefab = null;

    @property({
        type: cc.Prefab,
        visible: function (this: SlotGameBase) {
            return this.autoGenerateLines;
        }
    })
    lightLinePrefab: cc.Prefab = null;

    protected betChoices: number[] = [];
    protected stake: number;
    protected ingameHandler: SlotGameIngameHandler;
    protected settlementHandler: SlotGameSettlementHandler;
    protected jackpotHandler: SlotGameJackpotHandler;
    protected bonusHandler: SlotGameBonusHandler;
    private jackpotPoolValue = -1;
    public slotGameConfigs: SlotGameBaseConfigs;
    public settleTween: cc.Tween;
    public showWinningLinesTween: cc.Tween;
    public showLoopWinningLinesTween: cc.Tween;
    public isAnimatingResult = false;
    public totalFreeSpins = 0;
    public jackpotPool = {};
    public onOpenBonusChest: (data: any) => void;
    public waitingSpinResult = false;
    public cacheApiError: any = null;
    public isShowAutoSpinSettingDialog = false;
    public isRound = false;
    public autoOpenAutoSpinDialog = false;
    protected userSettings: SlotGameUserSettings;
    private showingWinningLine = false;

    setAllowChangeBet(allow: boolean) {
        this.stakeButton.interactable = allow;
    }

    onLoad() {
        super.onLoad();
        this.initDefaultBetChoices();
        this.initEventForNumberContainer();
        this.initSlotGameConfig();
        this.loadSlotGameConfig();
        this.showJackpotInfo(this.jackpotEnabled);

        this.node.on(cc.Node.EventType.SIZE_CHANGED, () => this.hideAllLines());

        if (this.autoGenerateLines) {
            this.createAllLines();
        }
    }

    start() {
        this.setBoardFullItems();
    }

    onDestroy() {
        super.onDestroy();
        const audioManager = AudioManager.getInstance();
        audioManager.removeMusicChanged(`${this.gameId}`);
    }

    protected onGameHide() {
        super.onGameHide();
        this.saveUserSetting();
    }

    override stopGame() {}

    showJackpotInfo(show: boolean) {
        if (!this.jackpotPoolLabel) {
            return;
        }
        this.jackpotPoolInfo.node.active = show;
        this.jackpotPoolLabel.node.parent.active = show;
    }

    showMessageDisplay(roundType: RoundType) {
        this.bottomMessage && this.bottomMessage.showMessages(roundType);
    }

    loadUserSetting() {
        const info = cc.sys.localStorage.getItem(`UserSetting_game_${this.gameId}`);

        if (info) {
            const defaultSettings: SlotGameUserSettings = {
                betChoices: this.betChoices,
                stake: this.stake,
                turboEnabled: false
            };
            const settings: SlotGameUserSettings = JSON.parse(info) || defaultSettings;
            this.turboToggle.isChecked = settings.turboEnabled;
            this.setBetChoices(settings.betChoices);
            this.setStake(settings.stake);
            this.onStakeChanged();
            this.updateStakeContainer();
        }

        //clear setting
        cc.sys.localStorage.setItem(`UserSetting_game_${this.gameId}`, "");
    }

    updateStakeContainer() {
        if (!this.gameConfigs) {
            return;
        }
        this.stakeContainer.toggleItems.forEach((item, index) => {
            if (this.stake === this.gameConfigs.stakeLevels[index]) {
                item.isChecked = true;
            }
        });
    }

    saveUserSetting() {
        if (this.betChoices.length === 0 || !this.stake) {
            return;
        }

        const currentSetting: SlotGameUserSettings = {
            betChoices: this.betChoices,
            stake: this.stake,
            turboEnabled: this.turboToggle.isChecked
        };

        cc.sys.localStorage.setItem(`UserSetting_game_${this.gameId}`, JSON.stringify(currentSetting));
    }

    initDefaultBetChoices() {
        if (this.betChoices.length === 0) {
            this.setBetChoices([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
        }
    }

    setBetChoices(betChoices: number[]) {
        this.betChoices = [...betChoices];
        this.updateLineChanged();
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new FourGuardiansSlotConfigs();
    }

    loadSlotGameConfig() {
        if (!this.slotGameConfigs) {
            return;
        }
        this.slotBoard.setConfig(this.slotGameConfigs);
    }

    loadStakeLevelsConfig() {
        this.setStake(this.gameConfigs.stakeLevels[0] || 0);
        this.onStakeChanged();
        this.stakeContainer.toggleItems.forEach((item, index) => {
            item.node.getChildByName("value").getComponent(cc.Label).string = numberWithCommas(this.gameConfigs.stakeLevels[index], 1);
        });
        this.loadUserSetting();
    }

    updateDisplayForRemoteConfig() {
        super.updateDisplayForRemoteConfig();
        this.loadStakeLevelsConfig();
    }

    createLineView(child: cc.Node) {
        const node = new cc.Node();
        const view = node.addComponent(LineView);
        view.linePrefab = this.linePrefab;
        view.lightPrefab = this.lightLinePrefab;
        view.board = this.slotBoard;
        view.label = child;
        node.name = child.name;
        node.active = false;
        return view;
    }

    createAllLines() {
        this.leftNumberContainer.node.children.forEach((child) => {
            const view = this.createLineView(child);
            view.isLabelLeft = true;
            this.lineContainer.addChild(view.node);
        });

        this.rightNumberContainer.node.children.forEach((child) => {
            const view = this.createLineView(child);
            view.isLabelLeft = false;
            this.lineContainer.addChild(view.node);
        });
    }

    disableGame() {
        this.gameState = GameState.Disabled;
    }

    setUpHandlers() {
        this.initHandlers();
        this.noticeHandler = new SlotGameBaseNoticeHandler(this);
        this.ingameHandler = new SlotGameIngameHandler(this);
        this.settlementHandler = new SlotGameSettlementHandler(this);
        this.jackpotHandler = new SlotGameJackpotHandler(this);
        this.bonusHandler = new SlotGameBonusHandler(this);
        this.betHandler = new SlotGameBetHandler(this);

        this.addHandlers(
            this.umHandler,
            this.noticeHandler,
            this.errorHandler,
            this.configsHandler,
            this.betHandler,

            this.ingameHandler,
            this.settlementHandler,
            this.jackpotHandler,
            this.bonusHandler
        );
    }

    clearWinningBet() {
        const winningBet = this.winningNode.getChildByName("winningBet");
        winningBet && winningBet.destroy();
    }

    private blinkUserBalance() {
        cc.tween(this.userProfile.userBalance.node)
            .repeat(3, cc.tween().to(0.1, { scale: 1.1 }).to(0.1, { scale: 1 }))
            .start();
    }

    private blinkWinningBet() {
        cc.tween(this.winningBet.node)
            .repeat(3, cc.tween().to(0.1, { scale: 1.1 }).to(0.1, { scale: 1 }))
            .start();
    }

    showAcceptedBet(bet: number) {
        this.blinkUserBalance();
    }

    showWinningBet(bet: number) {
        this.playAnimationWinningBet();
        this.playSound(SlotGameSound.WIN);
        this.scheduleOnce(() => {
            this.updateWinningBetLabel(bet);
            this.blinkWinningBet();
        }, 0.5);
    }

    playAnimationWinningBet() {
        this.winningBetEffect.active = true;
        const skeleton = this.winningBetEffect.getComponent(sp.Skeleton);
        skeleton.setAnimation(0, skeleton.animation, false);
    }

    updateWinningBetLabel(bet: number) {
        this.winningBet.string = numberWithCommas(bet);
        this.updateUserBalance();
    }

    onLineSelectionClick() {
        AudioManager.getInstance().playClick();
        this.expandableMenu.collapseMenu();
        this.hideStakeContrainer();

        const node = cc.instantiate(this.lineSelectionDialog);
        this.currentMiniPanel.addDialog(node);

        const dialog = node.getComponent(LineSelectionDialog);
        dialog.setCheckItems(this.betChoices);
        dialog.onConfirmCallback = (betChoices) => {
            this.betChoices = betChoices;
            this.updateLineChanged();
            if (betChoices.length === 0) {
                this.deactiveSpinButton();
                this.autoSpinToggle.interactable = false;
                this.autoSpinToggle.isChecked = false;
            } else {
                this.activeSpinButton();
                this.autoSpinToggle.interactable = true;
            }
        };
    }

    onStakeButtonClick() {
        AudioManager.getInstance().playClick();
        this.expandableMenu.collapseMenu();

        const isShowing = this.stakeContainer.node.active && this.stakeContainer.node.scaleY === 1;
        if (!isShowing) {
            this.showStakeContainer();
        } else {
            this.hideStakeContrainer();
        }
    }

    hideStakeContrainer() {
        const node = this.stakeContainer.node;
        cc.tween(node)
            .to(0.2, { scaleY: 0 })
            .call(() => {
                node.active = false;
            })
            .start();
    }

    showStakeContainer() {
        const node = this.stakeContainer.node;
        node.active = true;
        node.scaleY = 0;
        cc.tween(node).to(0.2, { scaleY: 1 }).start();
    }

    onAutoSpinChanged() {
        AudioManager.getInstance().playClick();
        this.expandableMenu.collapseMenu();
        this.deactiveButtons();
        this.hideStakeContrainer();

        if (!this.isAutoSpinMode() || !this.checkAvailableBalance()) {
            this.resetStateButtons();
            return;
        }

        if (!this.isAnimatingResult && !this.isFreeSpin()) {
            this.createAutoSpinDialog();
        }

        this.updateBottomMessageStatus();
    }

    createAutoSpinDialog(): AutoSpinSettingDialog {
        const node = cc.instantiate(this.autoSpinDialogPrefab);
        this.currentMiniPanel.addDialog(node);
        this.isShowAutoSpinSettingDialog = true;
        const dialog = node.getComponent(AutoSpinSettingDialog);
        dialog.onConfirmCallback = (autoSpinCount: number) => {
            this.setAutoSpinCount(autoSpinCount);
            this.updateModeSpinButton(false);
            this.lastAutoSpinCount = autoSpinCount;
            this.spin();
            this.isShowAutoSpinSettingDialog = false;
            this.autoOpenAutoSpinDialog = false;
        };

        dialog.onCancelCallback = () => {
            this.resetStateButtons();
            this.autoOpenAutoSpinDialog && this.showMessageDisplay(RoundType.SETTLED);
            this.isShowAutoSpinSettingDialog = false;
            this.autoOpenAutoSpinDialog = false;
        };

        if (this.lastAutoSpinCount) {
            dialog.setLastSelected(this.lastAutoSpinCount);
        }

        const turboDialog = node.getComponent(TurboAutoSpinSettingDialog);
        if (turboDialog) {
            turboDialog.syncTurboToggle(this.turboToggle.isChecked);
            turboDialog.turboChangedCallback = (value: boolean) => this.setAndSaveSettingTurbo(value);
        }

        return dialog;
    }

    setAutoSpinCount(count: number) {
        this.autoSpinCount = count;
        if (this.enabledBottomMessage && this.bottomMessage) {
            this.bottomMessage.autoSpinCount = count;
        } else {
            this.spinButton && this.spinButton.setAutoSpinCount(count);
        }
    }

    getCurrentTotalBet() {
        const total = this.stake * this.betChoices.length;
        return +total.toFixed(1);
    }

    updateTotalBetLabel() {
        const total = this.getCurrentTotalBet();
        this.totalBet.string = numberWithCommas(total, 1);
    }

    setStake(stake: number) {
        this.stake = stake;
        this.stakeLabel.string = numberWithCommas(stake, 1);
    }

    updateLineChanged() {
        this.lineLabel.string = `${this.betChoices.length}`;
        this.updateTotalBetLabel();
    }

    onStakeToggleChanged(event: cc.Event, param: string) {
        AudioManager.getInstance().playClick();
        this.setStake(this.gameConfigs.stakeLevels[+param]);
        this.onStakeChanged();
    }

    onStakeChanged() {
        this.updateTotalBetLabel();
        this.updateDisplayPool();
        this.hideStakeContrainer();
        if (this.jackpotPoolInfo) {
            this.jackpotPoolInfo.setHighlight(this.stake);
        }
    }

    setBoardFullItems() {
        const data = [];
        const itemTypeCount = this.slotBoard.itemTypeCount;

        for (let i = 0; i < 15; i++) {
            if (i < itemTypeCount) {
                data.push(i);
            } else {
                data.push(_.random(itemTypeCount - 1));
            }
        }

        const shuffleData = _.shuffle(data);
        this.slotBoard.setBoardData(shuffleData);
        this.slotBoard.applyData(shuffleData);
    }

    onSpinClick(hold: boolean) {
        AudioManager.getInstance().playClick();
        this.isHoldAction = hold;
        this.spinAction();
    }

    spinAction() {
        this.expandableMenu.collapseMenu();
        const success = this.spin();
        if (success) {
            this.lineButton.interactable = false;
            this.stakeButton.interactable = false;
        }
    }

    async setDataAndSpin(data: any) {
        this.playSound(SlotGameSound.SPIN);
        this.winningBet.string = "0";
        this.slotBoard.setBoardData(data);
        this.spinButton.playAnimationSpin();
        await this.slotBoard.spin(this.getCustomDuration("spin"), this.isTurboMode());
        this.spinButton.playAnimationIdle();
    }

    spin(): boolean {
        this.updateBottomMessageStatus();

        let success = false;
        if (this.betChoices.length === 0 || this.isAnimatingResult || !this.isReadyBet()) {
            return success;
        }

        const balanceAvailable = this.isFreeSpin() || this.checkAvailableBalance();
        if (!balanceAvailable) {
            this.resetStateButtons();
            return success;
        }

        if (this.waitingProcessing) {
            !this.isHoldAction && this.showProcessingWarning(true);
            return success;
        }
        this.showMessageDisplay(RoundType.SPINNING);
        this.stopAllFinishTweens();
        this.hideStakeContrainer();
        this.hideWinningEffectOnItems();

        this.lockBet();
        const isFreeSpin = this.isFreeSpin();
        const data = {
            betChoice: this.betChoices,
            amount: this.stake,
            freeSpin: isFreeSpin
        };

        this.waitingSpinResult = true;
        if (!isFreeSpin) {
            this.consumeAutoSpinCount();
        }
        this.socket.emit("bet", data);
        success = true;
        return success;
    }

    setTotalFreeSpins(value: number) {
        this.totalFreeSpins = value;
    }

    updateDisplaySpinButtons() {
        this.spinButton.setFreeSpinValue(this.totalFreeSpins);
        const showFreeSpin = this.totalFreeSpins >= 0;
        this.updateModeSpinButton(showFreeSpin);
    }

    updateModeSpinButton(isFreeSpin: boolean) {
        if (isFreeSpin) {
            this.totalBet.string = "0";
            this.spinButton.showFreeSpinMode();
            return;
        }
        this.updateTotalBetLabel();
        const showAutoSpin = this.stillAutoSpin() && this.isAutoSpinMode();
        if (showAutoSpin) {
            this.spinButton.showAutoSpinMode();
            return;
        }

        this.spinButton.showNormalMode();
    }

    showActiveFreeSpinButton() {
        this.spinButton.showTextSpinInFreeSpin(true);
        this.activeSpinButton();
    }

    activeSpinButton() {
        this.spinButton.active();
    }

    deactiveSpinButton() {
        this.spinButton.deactive();
    }

    deactiveButtons() {
        this.deactiveSpinButton();
        this.lineButton.interactable = false;
        this.stakeButton.interactable = false;

        if (!this.isAutoSpinMode()) {
            this.autoSpinToggle.interactable = false;
        }
    }

    activeButtons() {
        const isFreeSpin = this.isFreeSpin();
        const isAutoSpinMode = this.isAutoSpinMode();
        const notAutoSpinByKeySpaceOrHold = !this.holdActionButton.isAutoAction;

        if (isAutoSpinMode || isFreeSpin) {
            this.deactiveSpinButton();
        } else {
            this.activeSpinButton();
        }

        const canChangeStakeAndLine = !isAutoSpinMode && !isFreeSpin && notAutoSpinByKeySpaceOrHold;
        this.lineButton.interactable = canChangeStakeAndLine;
        this.stakeButton.interactable = canChangeStakeAndLine;

        this.autoSpinToggle.interactable = (isAutoSpinMode || !isFreeSpin) && notAutoSpinByKeySpaceOrHold;
    }

    initEventForNumberContainer() {
        const callback = {
            onMove: (e) => {
                if (!this.showingWinningLine) {
                    this.showLineWhenHover(e);
                }
            },
            onLeave: (e) => {
                if (!this.showingWinningLine) {
                    this.hideAllLines();
                }
            }
        };
        this.leftNumberContainer.touchCallback = callback;
        this.rightNumberContainer.touchCallback = callback;
    }

    showLineWhenHover(e) {
        const container: cc.Node = e.getCurrentTarget();
        const localPosition = container.convertToNodeSpaceAR(e.getLocation());
        container.children.forEach((child) => {
            const show = child.getBoundingBox().contains(localPosition);
            this.showLine(+child.name, show);
        });
    }

    hideAllLines() {
        this.lineContainer.children.forEach((child) => (child.active = false));
    }

    showLine(num: number, show = true) {
        const line = this.lineContainer.getChildByName(`${num}`);
        if (line) {
            line.active = show;
        }
    }

    showWinningLines(winningLines: LineData[], delayTime: number) {
        winningLines.forEach((line) => this.showLine(line.payline + 1));

        if (winningLines.length === 0) {
            return;
        }

        this.showingWinningLine = true;
        this.showWinningLinesTween = cc
            .tween(this)
            .delay(delayTime)
            .call(() => {
                this.showLoopWinningLines(winningLines);
            })
            .start();
    }

    showLoopWinningLines(winningLines: LineData[]) {
        const length = winningLines.length;
        const timeShowPayline = this.isTurboMode ? 0.75 : 1;
        if (length === 0) {
            return;
        }
        let index = 0;
        this.showLoopWinningLinesTween = cc
            .tween(this)
            .repeatForever(
                cc
                    .tween()
                    .call(() => {
                        if (index === length) {
                            index = 0;
                        }
                        this.hideAllLines();
                        this.hideWinningEffectOnItems();
                        const line = winningLines[index];
                        this.showLine(line.payline + 1);
                        this.slotBoard.showWinningEffect(line.positions, +line.symbol);
                        index++;
                    })
                    .delay(timeShowPayline)
            )
            .start();
    }

    stopAllFinishTweens() {
        this.isAnimatingResult = false;
        this.clearWinningBet();
        this.hideAllLines();
        if (this.settleTween) {
            this.settleTween.stop();
        }

        this.showingWinningLine = false;
        if (this.showWinningLinesTween) {
            this.showWinningLinesTween.stop();
        }
        if (this.showLoopWinningLinesTween) {
            this.showLoopWinningLinesTween.stop();
        }
    }

    onClickShowHistory() {
        AudioManager.getInstance().playClick();
        this.expandableMenu.collapseMenu();

        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(SlotGameHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.addDialog(dialog);
    }

    openGuide() {
        super.openGuide();
        this.expandableMenu.collapseMenu();
    }

    onClickShowTopWinner() {
        AudioManager.getInstance().playClick();
        this.expandableMenu.collapseMenu();

        const dialog = cc.instantiate(this.topWinnerPrefab);
        const topWinnerComponent = dialog.getComponent(SlotGameTopWinner);
        topWinnerComponent.init(this.socket, this.gameName, this.jackpotEnabled);
        this.currentMiniPanel.addDialog(dialog);
    }

    public get jackpotEnabled() {
        return false;
    }

    onClickShowHallOfFame() {
        AudioManager.getInstance().playClick();
        this.expandableMenu.collapseMenu();
    }

    async showEffectFreeSpin() {
        if (this.soundSources[SlotGameSound.FREESPIN]) {
            this.playSound(SlotGameSound.FREESPIN);
        }
        const effect = cc.instantiate(this.effectFreeSpin);
        const animation = effect.getComponent(CallbackAnimation);
        animation.setDuration(this.getCustomDuration("freespin"));
        await this.showEffect(effect);
        this.updateDisplaySpinButtons();
    }

    getCustomDuration(type: string): number {
        const isTurboMode = this.isTurboMode();
        const info = isTurboMode ? this.slotGameConfigs.turboMode : this.slotGameConfigs.normalMode;
        switch (type) {
            case "bigwin":
                return info.bigWinDuration;
            case "showBigWinValue":
                return info.showBigWinValueDuration;
            case "freespin":
                return info.freespinDuration;
            case "bonus":
                return info.bonusDuration;
            case "jackpot":
                return info.jackpotDuration;
            case "win":
                return info.winningDuration;
            case "lose":
                return info.noWinningDuration;
            case "spin":
                return info.spinDuration;
            case "acceptedBet":
                return isTurboMode ? 0.5 : 1;
        }
        return 0;
    }

    async showEffectBigWin(betWin: number) {
        if (this.soundSources[SlotGameSound.BIG_WIN]) {
            this.playSound(SlotGameSound.BIG_WIN);
        }

        const effect = cc.instantiate(this.effectBigWin);
        const callbackAnim = effect.getComponent(CallbackAnimation);
        callbackAnim.setDuration(this.getCustomDuration("bigwin"));
        const bigWinAnimation = effect.getComponent(BigWinAnimation);
        const showBigWinValueTime = this.getCustomDuration("showBigWinValue");
        bigWinAnimation.setAmount(betWin, showBigWinValueTime);
        cc.tween(this)
            .delay(showBigWinValueTime)
            .call(() => this.updateWinningBetLabel(betWin))
            .start();
        await this.showEffect(effect);
    }

    async showEffectBonus(bonus: number): Promise<void> {
        if (this.soundSources[SlotGameSound.BONUS]) {
            this.playSound(SlotGameSound.BONUS);
        }
        return new Promise<void>(async (resolve, reject) => {
            const effect = cc.instantiate(this.effectBonus);
            const animation = effect.getComponent(CallbackAnimation);
            animation.setDuration(this.getCustomDuration("bonus"));
            await this.showEffect(effect);
            const node = cc.instantiate(this.bonusDialog);
            this.currentMiniPanel.addDialog(node);
            const dialog = node.getComponent(BonusDialog);
            dialog.slotGameConfigs = this.slotGameConfigs;
            dialog.setBonusCount(bonus);
            dialog.onBonusFinished = resolve;
            dialog.onItemClicked = (index) => {
                this.socket.emit("bonus", { chest: index });
            };
            this.onOpenBonusChest = (data) => {
                dialog && dialog.openBonus(data.chest, data.amount);
            };
        });
    }

    async showEffectJackpot(amount: number) {
        this.playSound(SlotGameSound.JACKPOT);

        const effect = cc.instantiate(this.effectJackpot);
        const callbackAnim = effect.getComponent(CallbackAnimation);
        const jackpotDuration = this.getCustomDuration("jackpot");
        callbackAnim.setDuration(jackpotDuration);
        const bigWinAnimation = effect.getComponent(BigWinAnimation);
        bigWinAnimation.setAmount(amount, jackpotDuration - 1);
        await this.showEffect(effect);
    }

    updatePoolData(data: any) {
        if (!this.jackpotEnabled) {
            return;
        }
        this.jackpotPool[data.pool] = data.amount;
        this.updateDisplayPool();

        const dataList = Object.keys(this.jackpotPool).map((key) => {
            return {
                pool: key,
                amount: this.jackpotPool[key]
            };
        });
        this.jackpotPoolInfo.setData(dataList);
        this.jackpotPoolInfo.setHighlight(this.stake);
    }

    updateDisplayPool() {
        const poolValue = this.jackpotPool[`${this.stake}`];
        if (poolValue && poolValue !== this.jackpotPoolValue) {
            this.jackpotPoolValue = poolValue;
            GameUtils.floatToNumber({ label: this.jackpotPoolLabel, amount: poolValue, duration: 0.6, noZeroSuffix: false });
        }
    }

    showWinningItems(winningLines: any[]) {
        winningLines.forEach((line) => {
            this.slotBoard.showWinningEffect(line.positions, +line.symbol);
        });
    }

    hideWinningEffectOnItems() {
        this.slotBoard.hideWinningEffect();
    }

    showHighlightSpecialSymbols(symbol: number) {
        this.slotBoard.showHighlightSpecialSymbols(symbol);
    }

    gotApiError(): boolean {
        if (this.cacheApiError) {
            const error = this.cacheApiError;
            this.currentMiniPanel.showErrorNotice(error);
            this.cacheApiError = null;

            this.resetStateButtons();
            return true;
        }
        return false;
    }

    resetStateButtons() {
        //compare with onAutoSpinOff()
        this.autoSpinToggle.isChecked = false;
        this.setAutoSpinCount(0);
        const isFreeSpin = this.isFreeSpin();
        this.updateModeSpinButton(isFreeSpin);
        this.activeButtons();
        if (isFreeSpin) {
            this.showActiveFreeSpinButton();
        }

        this.updateBottomMessageStatus();
    }

    playMusicBgCallback() {
        this.musicBg.play();
    }

    playMusicBackground(play: boolean) {
        const musicPlayer = MusicPlayer.getInstance();
        if (play) {
            if (musicPlayer.isPlayBgMusic) {
                this.scheduleOnce(this.playMusicBgCallback, MusicPlayer.getInstance().delayTurnOffMusicBg);
            } else {
                this.playMusicBgCallback();
            }
        } else {
            this.unschedule(this.playMusicBgCallback);
            this.musicBg.stop();
        }
    }

    playSound(type: SlotGameSound) {
        AudioManager.getInstance().playSFX(this.soundSources[type].clip);
    }

    override checkShowUmMessage(data: any) {
        return !this.isAnimatingResult;
    }
}
