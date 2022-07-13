import * as i18n from "i18n/runtime-scripts/LanguageData";
import * as _ from "lodash";

import AudioManager from "../../common/audio/AudioManager";
import MusicPlayer from "../../common/audio/MusicPlayer";
import CallbackAnimation from "../../common/CallbackAnimation";
import ExpandableMenu from "../../common/expandable-menu/view-models/ExpandableMenu";
import GameUtils from "../../common/GameUtils";
import { numberWithCommas } from "../../common/helpers/NumberHelper";
import HoverItemBase from "../../common/HoverItemBase";
import UserProfile from "../../common/user-profile/UserProfile";
import JackpotPoolInfoBase from "../../lobby/main/view-models/JackpotPoolInfoBase";
import { GameState } from "../_base/GameState";
import SocketIOTableGameBase from "../_base/SocketIOTableGameBase";
import LineView from "../AHCL/scripts/LineView";
import { FourGuardiansSlotConfigs } from "../four-guardians/scripts/FourGuardiansSlotConfigs";
import AutoSpinSettingDialog from "./AutoSpinSettingDialog";
import BigWinAnimation from "./BigWinAnimation";
import BonusDialog from "./BonusDialog";
import ClassicSpinButton from "./ClassicSpinButton";
import CountDownWarning from "./CountDownWarning";
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

export enum RoundType {
    BEFORESPIN = 0,
    SPINNING = 1,
    SETTLED = 2
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameBase extends SocketIOTableGameBase {
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

    @property(cc.Toggle)
    autoSpinToggle: cc.Toggle = null;

    @property(cc.Toggle)
    turboToggle: cc.Toggle = null;

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

    @property(cc.Node)
    effectContainer: cc.Node = null;

    @property(cc.Node)
    defaultMiniMenu: cc.Node = null;

    @property(cc.Prefab)
    lineSelectionDialog: cc.Prefab = null;

    @property(cc.Prefab)
    bonusDialog: cc.Prefab = null;

    @property(ExpandableMenu)
    expandableMenu: ExpandableMenu = null;

    @property(CountDownWarning)
    countDownAutoSpin: CountDownWarning = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    topWinnerPrefab: cc.Node = null;

    @property(cc.Prefab)
    effectBigWin: cc.Prefab = null;

    @property(cc.Prefab)
    effectFreeSpin: cc.Prefab = null;

    @property(cc.Prefab)
    effectBonus: cc.Prefab = null;

    @property(cc.Prefab)
    effectJackpot: cc.Prefab = null;

    @property(JackpotPoolInfoBase)
    jackpotPoolInfo: JackpotPoolInfoBase = null;

    @property({ type: cc.AudioSource })
    soundSources: cc.AudioSource[] = [];

    @property(cc.Prefab)
    autoSpinDialogPrefab: cc.Prefab = null;

    @property(ClassicSpinButton)
    spinButton: ClassicSpinButton = null;

    @property(cc.Label)
    messageText: cc.Label = null;

    @property({ type: UserProfile })
    userProfile: UserProfile = null;

    @property
    autoGenerateLines = false;

    @property
    offerKeySpaceOrHoldSpin = false;

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
    public isKeyDownSpace = false;
    public isHoldSpinButton = false;
    public isRound = false;
    protected userSettings: SlotGameUserSettings;
    private autoSpinCount = 0;
    private showingWinningLine = false;

    onLoad() {
        super.onLoad();
        this.initDefaultBetChoices();
        this.initEventForNumberContainer();
        this.initSlotGameConfig();
        this.loadSlotGameConfig();
        this.showJackpotInfo(this.jackpotEnabled);

        this.currentMiniPanel.skipShowApiErrorGameIds.push(this.gameId);
        this.setDefaultPositionForMiniMenu();

        const audioManager = AudioManager.getInstance();
        this.playMusicBackground(audioManager.musicEnabled);
        audioManager.addMusicChanged(`${this.gameId}`, this.playMusicBackground.bind(this));

        this.node.on(cc.Node.EventType.SIZE_CHANGED, () => this.hideAllLines());
        this.registerKeyEvents();
        this.showMessageDisplay(RoundType.BEFORESPIN);
        if (this.offerKeySpaceOrHoldSpin) {
            this.spinButton.node.on(cc.Node.EventType.TOUCH_START, () => this.holdSpinButton());
            this.spinButton.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
                const location = event.getLocation();
                const hit = this.spinButton.node._hitTest(location);
                if (!hit) {
                    this.notHoldSpinButton();
                    event.stopPropagation();
                }
            });
            this.spinButton.node.on(cc.Node.EventType.TOUCH_CANCEL, this.notHoldSpinButton, this);
            this.spinButton.node.on(
                cc.Node.EventType.TOUCH_END,
                (event: cc.Event.EventTouch) => {
                    const location = event.getLocation();
                    const hit = this.spinButton.node._hitTest(location);
                    this.notHoldSpinButton();
                    if (hit) {
                        this.spinAction();
                    }
                },
                this
            );
        }
    }

    updateForHoldSpinButton() {
        if (this.isHoldSpinButton) {
            this.spin();
        }
    }

    checkPreventFunctionHoldAction() {
        return (
            this.currentMiniPanel.dialog.childrenCount > 0 ||
            this.currentMiniPanel.guideContainer.childrenCount > 0 ||
            this.autoSpinCount > 0
        );
    }

    holdSpinButton() {
        if (this.checkPreventFunctionHoldAction()) {
            return;
        }
        this.isHoldSpinButton = true;
        this.schedule(this.updateForHoldSpinButton, 0.3, cc.macro.REPEAT_FOREVER, 0);
    }

    notHoldSpinButton() {
        this.isHoldSpinButton = false;
        this.unschedule(this.updateForHoldSpinButton);
    }

    showJackpotInfo(show: boolean) {
        if (!this.jackpotPoolLabel) {
            return;
        }
        this.jackpotPoolInfo.node.active = show;
        this.jackpotPoolLabel.node.parent.active = show;
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

    showMessageDisplay(roundType: RoundType) {
        if (!this.messageText) {
            return;
        }
        const msgList = ["showMsgWhenSpin", "roundSettleMsg", "FromSettleToSpin"];
        let msg = `messages.roundSettleMsg`;
        if (roundType === RoundType.BEFORESPIN) {
            if (cc.sys.isMobile) {
                msg = `messages.${msgList[roundType] + "Phone"}`;
            } else {
                msg = `messages.${msgList[roundType] + "Desktop"}`;
            }
        }
        if (roundType === RoundType.SETTLED) {
            const items = this.isTurboMode() ? [1, 2] : [1, 2, 3];
            const item = items[_.random(items.length - 1)];
            msg = `messages.FromSettleToSpin${item}`;
        }
        this.messageText.string = `${i18n.t(msg)}`;
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

    setDefaultPositionForMiniMenu() {
        if (!this.currentMiniPanel.popupMiniGame) {
            this.scheduleOnce(this.setDefaultPositionForMiniMenu, 0.1);
            return;
        }
        const node = this.currentMiniPanel.popupMiniGame.node;
        const wPosition = this.defaultMiniMenu.convertToWorldSpaceAR(cc.v2(0, 0));
        const localPosition = node.parent.convertToNodeSpaceAR(wPosition);
        node.position = cc.v3(node.x, localPosition.y);
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

    start() {
        this.setBoardFullItems();
        if (this.autoGenerateLines) {
            this.createAllLines();
        }
    }

    registerKeyEvents() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    removeKeyEvents() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        if (
            this.offerKeySpaceOrHoldSpin &&
            !this.isAutoSpinMode() &&
            (event.keyCode === cc.macro.KEY.space || event.keyCode === cc.macro.KEY.enter)
        ) {
            if (this.checkPreventFunctionHoldAction()) {
                return;
            }
            this.isKeyDownSpace = true;
            this.spinAction();
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        if (
            this.offerKeySpaceOrHoldSpin &&
            !this.isAutoSpinMode() &&
            (event.keyCode === cc.macro.KEY.space || event.keyCode === cc.macro.KEY.enter)
        ) {
            this.isKeyDownSpace = false;
            if (!this.isAnimatingResult) {
                this.activeButtons();
            }
        }
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

    override stopGame() {}

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

    checkAvailableBalance(): boolean {
        const total = this.getCurrentTotalBet();
        if (cc.RedT.user.red < total && !this.isFreeSpin()) {
            this.showMiniWarning(i18n.t("messages.notEnoughMoney"));
            this.autoSpinToggle.isChecked = false;
            return false;
        }
        return true;
    }

    onTurboModeChanged(toggle: cc.Toggle) {
        AudioManager.getInstance().playClick();

        const turboWarningName = "turbo_warning";
        this.noticeNode.children.forEach((child) => {
            if (child.name === turboWarningName) {
                child.destroy();
            }
        });

        const key = toggle.isChecked ? "enableTurboMode" : "disableTurboMode";
        const message = i18n.t(`messages.${key}`);
        const notice = this.showMiniWarning(message);
        notice && (notice.name = turboWarningName);
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
    }

    createAutoSpinDialog(): AutoSpinSettingDialog {
        const node = cc.instantiate(this.autoSpinDialogPrefab);
        this.currentMiniPanel.addDialog(node);
        this.isShowAutoSpinSettingDialog = true;
        const dialog = node.getComponent(AutoSpinSettingDialog);
        dialog.onConfirmCallback = (autoSpinCount: number) => {
            this.setAutoSpinCount(autoSpinCount);
            this.updateModeSpinButton(false);
            this.hideWinningEffectOnItems();
            this.stopAllFinishTweens();

            const onFinished = () => {
                this.spinButton.active();
                this.spin();
            };
            const checkCancel = () => !this.isAutoSpinMode();
            const onCancel = () => this.spinButton.active();

            this.countDownAutoSpin.show(autoSpinCount, onFinished, checkCancel, onCancel);
            this.isShowAutoSpinSettingDialog = false;
            this.spinButton.deactive();
        };

        dialog.onCancelCallback = () => {
            this.resetStateButtons();
            this.isShowAutoSpinSettingDialog = false;
        };

        return dialog;
    }

    consumeAutoSpinCount() {
        if (this.autoSpinCount > 0) {
            this.setAutoSpinCount(this.autoSpinCount - 1);
        }
    }

    setAutoSpinCount(count: number) {
        this.autoSpinCount = count;
        this.spinButton.setAutoSpinCount(count);
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

    onSpinClick() {
        AudioManager.getInstance().playClick();
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
        let success = false;
        if (this.betChoices.length === 0 || this.isAnimatingResult || !this.isReadyBet()) {
            return success;
        }
        if (!this.checkAvailableBalance()) {
            this.resetStateButtons();
            return success;
        }

        if (this.waitingProcessing) {
            !this.isKeyDownSpace && !this.isHoldSpinButton && this.showProcessingWarning(true);
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
        const notAutoSpinByKeySpaceOrHold = !this.isKeyDownSpace && !this.isHoldSpinButton;

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

    isAutoSpinMode() {
        return this.autoSpinToggle.isChecked;
    }

    stillAutoSpin() {
        return this.autoSpinCount > 0;
    }

    isFreeSpin(): boolean {
        return this.totalFreeSpins > 0;
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

    openGuide() {
        super.openGuide();
        AudioManager.getInstance().playClick();
        this.expandableMenu.collapseMenu();
    }

    onClickShowHistory() {
        AudioManager.getInstance().playClick();
        this.expandableMenu.collapseMenu();

        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(SlotGameHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.addDialog(dialog);
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

    showEffect(effect: cc.Node): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.effectContainer.addChild(effect);

            const animation = effect.getComponent(CallbackAnimation);
            animation.onFinishedCallback = () => resolve();
            animation.play();
        });
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

    isTurboMode(): boolean {
        return this.turboToggle.isChecked || this.isKeyDownSpace || this.isHoldSpinButton;
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
        this.autoSpinToggle.isChecked = false;
        this.setAutoSpinCount(0);
        const isFreeSpin = this.isFreeSpin();
        this.updateModeSpinButton(isFreeSpin);
        this.activeButtons();
        if (isFreeSpin) {
            this.showActiveFreeSpinButton();
        }
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
