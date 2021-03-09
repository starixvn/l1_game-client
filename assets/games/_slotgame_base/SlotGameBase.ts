import * as _ from 'lodash';

import CallbackAnimation from '../../common/CallbackAnimation';
import ExpandableMenu from '../../common/ExpandableMenu';
import GameUtils from '../../common/GameUtils';
import { numberWithCommas } from '../../common/helpers/NumberHelper';
import HoverItemBase from '../../common/HoverItemBase';
import JackpotPoolInfoBase from '../../lobby/main/view-models/JackpotPoolInfoBase';
import { GameState } from '../_base/GameBase';
import SocketIOTableGameBase from '../_base/SocketIOTableGameBase';
import AutoSpinSettingDialog from './AutoSpinSettingDialog';
import BigWinAnimation from './BigWinAnimation';
import BonusDialog from './BonusDialog';
import CountDownWarning from './CountDownWarning';
import SlotGameBetHandler from './handlers/SlotGameBetHandler';
import SlotGameBonusHandler from './handlers/SlotGameBonusHandler';
import SlotGameIngameHandler from './handlers/SlotGameIngameHandler';
import SlotGameJackpotHandler from './handlers/SlotGameJackpotHandler';
import SlotGameSettlementHandler from './handlers/SlotGameSettlementHandler';
import SlotGameUmHandler from './handlers/SlotGameUmHandler';
import LineSelectionDialog from './LineSelectionDialog';
import SlotBoard from './SlotBoard';
import { SlotGameBaseConfigs } from './SlotGameBaseConfigs';
import SlotGameUserSettings from './SlotGameUserSettings';

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
    BONUS = 4
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

    @property(cc.Button)
    spinButton: cc.Button = null;

    @property(cc.Toggle)
    autoSpinToggle: cc.Toggle = null;

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

    @property(cc.Label)
    freeSpinLabel: cc.Label = null;

    @property(cc.Node)
    normalSpinNode: cc.Node = null;

    @property(cc.Node)
    freeSpinNode: cc.Node = null;

    @property(cc.Label)
    autoSpinCountLabel: cc.Label = null;

    @property(cc.Node)
    textFreeSpinNode: cc.Node = null;

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

    @property(cc.AudioSource)
    musicBg: cc.AudioSource = null;

    @property({ type: cc.AudioSource })
    soundSources: cc.AudioSource[] = [];

    @property(cc.Prefab)
    autoSpinDialogPrefab: cc.Prefab = null;

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
    protected userSettings: SlotGameUserSettings;
    private autoSpinCount = 0;

    onLoad() {
        super.onLoad();
        this.initDefaultBetChoices();
        this.initEventForNumberContainer();
        this.initSlotGameConfig();
        this.loadSlotGameConfig();

        this.currentMiniPanel.skipShowApiErrorGameIds.push(this.gameId);
        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                this.setDefaultPositionForMiniMenu();
            })
            .start();

        cc.RedT.isSoundGame() ? this.updateSoundStatus(true) : this.updateSoundStatus(false);

        cc.RedT.addSoundObserver(`sound_observer_${this.gameId}`, this.updateSoundStatus.bind(this));
    }

    showJackpotInfo(show: boolean) {
        this.jackpotPoolInfo.node.active = show;
        this.jackpotPoolLabel.node.parent.active = show;
    }

    onDestroy() {
        super.onDestroy();
        cc.RedT.removeSoundObserver(`sound_observer_${this.gameId}`);
    }

    protected onGameHide() {
        super.onGameHide();
        this.saveUserSetting();
    }

    updateSoundStatus(status: boolean) {
        status ? this.playMusicBackground() : this.playMusicBackground(false);
    }

    loadUserSetting() {
        const info = cc.sys.localStorage.getItem(`UserSetting_game_${this.gameId}`);

        if (info) {
            const defaultSettings: SlotGameUserSettings = {
                betChoices: this.betChoices,
                stake: this.stake
            };
            const settings: SlotGameUserSettings = JSON.parse(info) || defaultSettings;
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
            stake: this.stake
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
        const wPosition = this.defaultMiniMenu.convertToWorldSpaceAR(cc.v2(0, 0));
        const localPosition = this.currentMiniPanel.miniMenu.parent.convertToNodeSpaceAR(wPosition);
        this.currentMiniPanel.miniMenu.position = cc.v2(this.currentMiniPanel.miniMenu.position.x, localPosition.y);
    }

    initSlotGameConfig() {}

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
        super.start();
        this.setBoardFullItems();
    }

    onEnable() {}

    onDisable() {}

    stopGame() {}

    disableGame() {
        this.gameState = GameState.Disabled;
    }

    setUpHandlers() {
        this.initHandlers();
        this.umHandler = new SlotGameUmHandler(this);
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

    showAcceptedBet(bet: number) {
        GameUtils.addFlyingText(this.noticeNode, false, bet, 1, 80);
    }

    showWinningBet(bet: number) {
        const winningBet = GameUtils.addFlyingText(this.winningNode, true, bet, this.slotGameConfigs.showWinningLineDuration, 80);
        winningBet.name = "winningBet";
        this.updateWinningBetLabel(bet);
        this.playSound(SlotGameSound.WIN);
    }

    updateWinningBetLabel(bet: number) {
        this.winningBet.string = numberWithCommas(bet);
        this.updateUserBalance();
    }

    onLineSelectionClick() {
        cc.RedT.audio.playClick();
        this.expandableMenu.collapseMenu();
        this.showStakeContainer(false);

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
        cc.RedT.audio.playClick();
        this.expandableMenu.collapseMenu();

        const isShowing = this.stakeContainer.node.active && this.stakeContainer.node.scaleY === 1;
        this.showStakeContainer(!isShowing);
    }

    showStakeContainer(show = true) {
        const node = this.stakeContainer.node;
        if (show) {
            node.active = true;
            node.scaleY = 0;
            cc.tween(node).to(0.2, { scaleY: 1 }).start();
        } else {
            cc.tween(node)
                .to(0.2, { scaleY: 0 })
                .call(() => {
                    node.active = false;
                })
                .start();
        }
    }

    checkAvailableBalance(): boolean {
        const total = this.getCurrentTotalBet();
        if (cc.RedT.user.red < total && !this.isFreeSpin()) {
            this.showMiniWarning("Bạn hiện không có đủ tiền để cược.");
            this.autoSpinToggle.isChecked = false;
            return false;
        }
        return true;
    }

    onAutoSpinChanged() {
        cc.RedT.audio.playClick();
        this.expandableMenu.collapseMenu();
        this.deactiveButtons();
        this.showStakeContainer(false);

        if (!this.isAutoSpinMode() || !this.checkAvailableBalance()) {
            this.setAutoSpinCount(0);
            this.updateModeSpinButton(false);
            this.activeButtons();
            return;
        }

        if (!this.isAnimatingResult && !this.isFreeSpin()) {
            const node = cc.instantiate(this.autoSpinDialogPrefab);
            this.currentMiniPanel.addDialog(node);
            const dialog = node.getComponent(AutoSpinSettingDialog);
            dialog.onConfirmCallback = (autoSpinCount: number) => {
                this.setAutoSpinCount(autoSpinCount);
                this.updateModeSpinButton(false);
                this.hideWinningEffectOnItems();
                this.stopAllFinishTweens();
                this.countDownAutoSpin.show(
                    autoSpinCount,
                    () => this.spin(),
                    () => !this.isAutoSpinMode()
                );
            };

            dialog.onCancelCallback = () => {
                this.setAutoSpinCount(0);
                this.resetStateButtons();
            };
        }
    }

    consumeAutoSpinCount() {
        if (this.autoSpinCount > 0) {
            this.setAutoSpinCount(this.autoSpinCount - 1);
        }
    }

    setAutoSpinCount(count: number) {
        this.autoSpinCount = count;
        this.autoSpinCountLabel.string = this.autoSpinCount.toString();
    }

    getCurrentTotalBet() {
        return this.stake * this.betChoices.length;
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
        cc.RedT.audio.playClick();
        this.setStake(this.gameConfigs.stakeLevels[+param]);
        this.onStakeChanged();
    }

    onStakeChanged() {
        this.updateTotalBetLabel();
        this.updateDisplayPool();
        this.showStakeContainer(false);
        this.jackpotPoolInfo.setHighlight(this.stake);
    }

    setBoardFullItems() {
        const data = [];
        const itemTypeCount = this.slotBoard.itemTypeCount;

        for (let i = 0; i < 15; i++) {
            if (i < itemTypeCount) {
                data.push(i);
            } else {
                data.push(Math.floor(Math.random() * itemTypeCount));
            }
        }

        const shuffleData = _.shuffle(data);
        this.slotBoard.setBoardData(shuffleData);
        this.slotBoard.applyData(shuffleData);
    }

    onSpinClick() {
        cc.RedT.audio.playClick();
        this.expandableMenu.collapseMenu();
        this.lineButton.interactable = false;
        this.stakeButton.interactable = false;

        this.spin();
    }

    async setDataAndSpin(data: any) {
        this.playSound(SlotGameSound.SPIN);
        this.slotBoard.setBoardData(data);
        await this.slotBoard.spin();
    }

    spin() {
        if (this.betChoices.length === 0 || this.isDisableGame || this.isAnimatingResult) {
            return;
        }

        if (!this.checkAvailableBalance()) {
            this.activeButtons();
            return;
        }

        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
            return;
        }

        this.stopAllFinishTweens();
        this.showStakeContainer(false);
        this.hideWinningEffectOnItems();

        this.waitingProcessing = true;
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
    }

    setTotalFreeSpins(value: number) {
        this.totalFreeSpins = value;
    }

    updateDisplaySpinButtons() {
        this.freeSpinLabel.string = `${this.totalFreeSpins}`;
        const showFreeSpin = this.totalFreeSpins >= 0;
        this.updateModeSpinButton(showFreeSpin);
    }

    updateDisplayFreeSpinNode() {
        this.updateModeSpinButton(this.isFreeSpin());
    }

    updateModeSpinButton(isFreeSpin: boolean) {
        this.freeSpinNode.active = isFreeSpin;

        const showAutoSpin = !isFreeSpin && this.autoSpinCount > 0;
        this.autoSpinCountLabel.node.parent.active = showAutoSpin;
        this.normalSpinNode.active = !showAutoSpin && !isFreeSpin;

        if (isFreeSpin) {
            this.totalBet.string = "0";
        } else {
            this.updateTotalBetLabel();
        }
    }

    resetFreeSpinButton() {
        this.textFreeSpinNode.active = true;
        this.activeSpinButton();
    }

    activeSpinButton() {
        this.spinButton.interactable = true;
    }

    deactiveSpinButton() {
        this.spinButton.interactable = false;
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

        if (isAutoSpinMode || isFreeSpin) {
            this.deactiveSpinButton();
        } else {
            this.activeSpinButton();
        }

        const canChangeStakeAndLine = !isAutoSpinMode && !isFreeSpin;
        this.lineButton.interactable = canChangeStakeAndLine;
        this.stakeButton.interactable = canChangeStakeAndLine;

        this.autoSpinToggle.interactable = isAutoSpinMode || !isFreeSpin;
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
            onMove: (e) => this.showLineWhenHover(e),
            onLeave: (e) => this.hideAllLines()
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
                    .delay(1)
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
        if (this.showWinningLinesTween) {
            this.showWinningLinesTween.stop();
        }
        if (this.showLoopWinningLinesTween) {
            this.showLoopWinningLinesTween.stop();
        }
    }

    onClickShowGuide() {
        cc.RedT.audio.playClick();
        this.expandableMenu.collapseMenu();
    }

    onClickShowHistory() {
        cc.RedT.audio.playClick();
        this.expandableMenu.collapseMenu();
    }

    onClickShowTopWinner() {
        cc.RedT.audio.playClick();
        this.expandableMenu.collapseMenu();
    }

    onClickShowHallOfFame() {
        cc.RedT.audio.playClick();
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
        const effect = cc.instantiate(this.effectFreeSpin);
        await this.showEffect(effect);
        this.updateDisplaySpinButtons();
    }

    async showEffectBigWin(betWin: number) {
        this.playSound(SlotGameSound.BIG_WIN);

        const effect = cc.instantiate(this.effectBigWin);
        const bigWinAnimation = effect.getComponent(BigWinAnimation);
        bigWinAnimation.setAmount(betWin);
        cc.tween(this)
            .delay(bigWinAnimation.textAnimationDuration)
            .call(() => this.updateWinningBetLabel(betWin))
            .start();
        await this.showEffect(effect);
    }

    async showEffectBonus(bonus: number): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const effect = cc.instantiate(this.effectBonus);
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
        const bigWinAnimation = effect.getComponent(BigWinAnimation);
        bigWinAnimation.setAmount(amount);
        await this.showEffect(effect);
    }

    updatePoolData(data: any) {
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
            GameUtils.floatToNumber(this.jackpotPoolLabel, poolValue, 0.6, undefined, false);
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
        this.activeButtons();
        if (this.isFreeSpin()) {
            this.resetFreeSpinButton();
        }
    }

    playMusicBackground(status = true) {
        if (status) {
            this.musicBg.play();
        } else {
            this.musicBg.stop();
        }
    }

    playSound(type: SlotGameSound) {
        if (cc.RedT.isSoundGame()) {
            this.soundSources[type].play();
        }
    }
}
