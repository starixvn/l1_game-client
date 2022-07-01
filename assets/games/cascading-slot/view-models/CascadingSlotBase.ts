import AudioManager from "../../../common/audio/AudioManager";
import CallbackLoopAnimation from "../../../common/CallbackLoopAnimation";
import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import { getTrialSocket } from "../../../common/helpers/UrlHelper";
import { CommonEvents } from "../../_new/_base/game-data-management/models/common-events";
import SocketIOConnection, { events } from "../../_new/connection/SocketIOConnection";
import BigWinAnimation from "../../_slotgame_base/BigWinAnimation";
import FeatureSlotGameBase from "../../_slotgame_base/FeatureSlotGameBase";
import { RoundType } from "../../_slotgame_base/SlotGameBottomMessage";
import { CascadingSlotGameSound } from "../../_slotgame_base/SlotGameSound";
import SlotGameTopMessage from "../../_slotgame_base/SlotGameTopMessage";
import { handleBetControl } from "../actions/CascadingSlotConfigAction";
import { handleSettle } from "../actions/CascadingSlotSettlementAction";
import { CascadingSlotFinishData, CascadingSlotFinishModel } from "../models/CascadingSlotFinishModel";
import CascadingSlotGameData from "../models/CascadingSlotGameData";
import { CascadingSlotState, CascadingSlotStateModel } from "../models/CascadingSlotStateModel";
import { CascadingSlotTrialModel } from "../models/CascadingSlotTrialModel";
import CascadingUIModel from "../models/CascadingUIModel";
import SpinButtonStateModel, { SpinButtonState } from "../models/SpinButtonStateModel";
import { CascadingSlotConfigModel } from "./../models/CascadingSlotConfigModel";
import CascadeSlotBoard from "./CascadeSlotBoard";
import CascadingBetControl, { TotalBetType } from "./CascadingBetControl";
import { CascadingSlotConfig } from "./CascadingSlotBaseConfig";
import CascadingSlotGameHistory from "./CascadingSlotGameHistory";
import CascadingSlotTumbleList from "./CascadingSlotTumbleList";
import CascadingTotalBet from "./CascadingTotalBet";
import FreeSpinView from "./FreeSpinView";
import TotalMultiplierView from "./TotalMultiplierView";
import TumbleWinView from "./TumbleWinView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotBase extends FeatureSlotGameBase {
    //#region override some properties to hide them
    @property({ visible: false, override: true })
    players: any[] = [];

    @property({ visible: false, override: true })
    otherPlayers: cc.Node = null;

    @property({ visible: false, override: true })
    userName: cc.Label = null;

    @property({ visible: false, override: true })
    userAvatar: cc.Sprite = null;

    @property({ visible: false, override: true })
    winningPlayerEffectPrefab: cc.Prefab = null;

    @property({ visible: false, override: true })
    betItems: any[] = [];

    @property({ visible: false, override: true })
    timeWaitNode: cc.Node = null;

    @property({ visible: false, override: true })
    timeWaitLabel: cc.Label = null;

    @property({ visible: false, override: true })
    animatedTime: any = null;

    @property({ visible: false, override: true })
    enableChips = false;

    @property({ visible: false, override: true })
    gameAudiosPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    betControlPrefab: cc.Prefab = null;

    //#endregion

    @property(CascadeSlotBoard)
    board: CascadeSlotBoard = null;

    @property(cc.Label)
    totalWinLabel: cc.Label = null;

    @property(cc.Prefab)
    flyWinLabelPrefab: cc.Prefab = null;

    @property(cc.Toggle)
    trialToggle: cc.Toggle = null;

    public gameData: CascadingSlotGameData<void>;
    public betControl: CascadingBetControl;
    public freeSpinView: FreeSpinView;
    public tumbleList: CascadingSlotTumbleList;
    totalMultiplierView: TotalMultiplierView = null;
    tumbleWinView: TumbleWinView = null;
    public isTrialMode = false;
    public trialUserBalance: number;

    topMessage: SlotGameTopMessage = null;
    protected trialConnection: SocketIOConnection;
    protected miniBetControl: CascadingTotalBet;
    private historyBtn: cc.Button;
    private currCoinValue: number;
    private currBetLevel: number;

    initTrialConnection() {
        if (!this.trialConnection) {
            this.trialConnection = new SocketIOConnection();
            const socketUri = getTrialSocket(this.gameId);
            const socket = this.currentMiniPanel.openSocketByUri(this.gameId, socketUri, this.registerTrialMode.bind(this));
            this.trialConnection.setSocket(socket, this.gameName);
            this.initGameEvents(socket);
        } else {
            this.registerTrialMode();
        }
    }

    onDestroy() {
        this.trialConnection && this.trialConnection.close();
        super.onDestroy();
    }

    registerTrialMode() {
        this.trialConnection.emit("inGame");
    }

    override checkShowUmMessage(data: any) {
        return this.gameData.stateModel.state !== CascadingSlotState.Spinning;
    }

    protected override loadUserData(user) {
        if (this.isTrialMode) {
            return;
        }
        super.loadUserData(user);
    }

    getUserBalance() {
        return this.isTrialMode ? this.trialUserBalance || 0 : super.getUserBalance();
    }

    override onEnable() {
        this.startGame();
        const storage = GameUtils.getGameSetting(this.gameId);
        if (storage.turboEnabled) {
            this.turboToggle.isChecked = storage.turboEnabled;
        }
        if (storage.trialMode) {
            const checked = true;
            this.trialToggle.isChecked = checked;
            this.isTrialMode = checked;
            this.updateForTrialMode();
            this.initTrialConnection();
        } else {
            this.registerViewGame();
        }
    }

    updateForTrialMode() {
        this.tumbleList.offerTrialMode(this.isTrialMode);
        this.holdActionButton.onlyButtonFunction = this.isTrialMode;
        this.historyBtn.interactable = !this.isTrialMode;
        this.autoSpinToggle.interactable = !this.isTrialMode;
        this.turboToggle.interactable = !this.isTrialMode;

        this.clearGameOnTrialModeChanged();
    }

    onTrialModeChanged(toggle: cc.Toggle) {
        AudioManager.getInstance().playClick();

        const checked = toggle.isChecked;
        this.isTrialMode = checked;
        if (checked) {
            this.initTrialConnection();
        } else {
            this.registerViewGame();
        }
        this.saveSettingKey("trialMode", checked);
        this.tumbleList.clear();
        this.updateForTrialMode();
    }

    clearGameOnTrialModeChanged() {
        this.clearGameRound();
        this.gameData.uiModel.resetNewRound();
        this.setAndSaveSettingTurbo(false);
        this.betControl.resetValues();
    }

    initHandlers() {
        super.initHandlers();
        this.timeHandler = null;
        this.betHandler = null;
        this.finishHandler = null;
    }

    getCurrentTotalBet(): number {
        return this.gameData.placeBetModel.data.totalBet;
    }

    spin(): boolean {
        let success = false;
        const balanceAvailable = this.isFreeSpin() || this.checkAvailableBalance();
        if (!this.isReadyBet() || !balanceAvailable) {
            this.onAutoSpinOff();
            return success;
        }

        if (this.gameData.stateModel.state === CascadingSlotState.Spinning) {
            return success;
        }

        const autoSpinAction = this.holdActionButton.isAutoAction;
        if (this.waitingProcessing && !autoSpinAction) {
            this.showProcessingWarning(true);
            return success;
        }
        this.lockBet();
        this.gameData.stateModel.change(CascadingSlotState.Start_Round);
        const isFreeSpin = this.isFreeSpin();
        if (isFreeSpin) {
            this.gameData.spinButtonStateModel.change(SpinButtonState.FreeSpin);
        }
        this.gameData.placeBetModel.updateFreeSpin(isFreeSpin);
        const connection = this.isTrialMode ? this.trialConnection : this.connection;
        connection.emit(events.bet, this.gameData.placeBetModel.data);
        success = true;
        return success;
    }

    getCustomDuration(key: string): number {
        const config = this.isTurboMode() ? CascadingSlotConfig.turbo : CascadingSlotConfig.normal;
        return config[key];
    }

    onLoad() {
        super.onLoad();
        this.board.initBoardFullItems();
        this.initGameDataEvents();
        this.currentMiniPanel.skipShowApiErrorGameIds.push(this.gameId);
    }

    start() {
        this.gameData.uiModel.resetNewRound();
    }

    protected initGameDataEvents() {
        this.gameData = new CascadingSlotGameData(this);

        this.gameData.finishModel.on(CascadingSlotFinishModel.Events.SETTLE, (data: CascadingSlotFinishData) => {
            handleSettle(this)(data).catch((err) => {
                console.warn(err);
            });
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.GET_TUMBLE, () => {
            this.tumbleWinView.showView(true);
            this.checkShowTopMessage();
            this.bottomMessage.showMessages(RoundType.TUMBLEWIN);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_TOTAL_WIN, (value: number) => {
            GameUtils.floatToNumber({ label: this.totalWinLabel, amount: value, duration: 0.5, noZeroSuffix: false });
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_TOTAL_BET, (data: TotalBetType) => {
            this.miniBetControl.totalBetLabel.string = data.totalBet.toLocaleString("en-US");
            this.miniBetControl.setIncreaseButtonStatus(data.increase);
            this.miniBetControl.setDecreaseButtonStatus(data.decrease);
            this.currCoinValue = data.coin;
            this.currBetLevel = data.level;
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_TUMBLE_WIN, (value: number) => {
            GameUtils.floatToNumber({ label: this.totalWinLabel, amount: value, duration: 0.5, noZeroSuffix: false });
            this.tumbleWinView.setTumbleWinValue(value, true);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_MULTIPLIER, (value: number) => {
            this.tumbleWinView.setMultiplier(value);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_TOTAL_MULTIPLIER, (data: { value: number; show: boolean }) => {
            this.totalMultiplierView.showView(data.show).then(() => {
                this.totalMultiplierView.setValue(data.value, data.show);
            });
            this.checkShowTopMessage();
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.SET_STAKE_FREESPINS, ({ coin, level }) => {
            this.betControl.updateSelectedCoinLevel(coin, level);
            this.betControl.updatePlaceBetAndUIModel();
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.SET_FREESPINS, (value: number) => {
            this.totalFreeSpins = value;
            this.freeSpinView.setValue(value);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.SHOW_FREESPINS, (show: boolean) => {
            this.freeSpinView.showView(show);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.INCREASE_FREESPINS, (value: number) => {
            this.freeSpinView.setValue(value);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.RESET_NEW_ROUND, () => {
            this.totalWinLabel.string = "0";
            this.tumbleWinView.showView(false, true).then(() => {
                this.tumbleWinView.clearLabels();
            });
            if (!this.isFreeSpin()) {
                this.totalMultiplierView.showView(false).then(() => {
                    this.totalMultiplierView.setValue(0, false);
                });
            }
            this.checkShowTopMessage();
        });

        this.gameData.gameConfig.on(CascadingSlotConfigModel.Events.CHANGE, (data: any) => {
            handleBetControl(this)(data);
            this.topMessage.updateMsgHaveMaxWin(+data.maxWinPerRound);
        });

        this.gameData.spinButtonStateModel.on(SpinButtonStateModel.Events.CHANGE, (state: SpinButtonState) => {
            switch (state) {
                case SpinButtonState.Normal:
                    this.spinButton.showNormalMode();
                    this.showBottomMessageOnGameState();
                    break;
                case SpinButtonState.AutoSpin:
                    this.spinButton.showAutoSpinMode();
                    this.bottomMessage.showMessages(RoundType.SPINNING);
                    break;
            }

            this.updateButtonsInteract();
        });

        this.gameData.stateModel.on(CascadingSlotStateModel.Events.CHANGE, (state) => {
            switch (state) {
                case CascadingSlotState.Start_Round:
                    this.tumbleList.clear();
                    this.gameData.uiModel.resetNewRound();
                    this.consumeAutoSpinCount();
                    this.consumeFreeSpinCount();
                    break;
                case CascadingSlotState.Spinning:
                    break;
                case CascadingSlotState.Settled:
                    this.clearHoldActionFlag();
                    break;
            }
            this.showBottomMessageOnGameState();
            this.updateButtonsInteract();
        });

        this.gameData.trialModel.on(CascadingSlotTrialModel.Events.CHANGE_USER_BALANCE, (value) => {
            this.trialUserBalance = value;
            this.userBalance.string = numberWithCommas(value);
        });

        this.gameData.on(CommonEvents.API_ERROR, (error) => {
            this.currentMiniPanel.showErrorNotice(error);
            if (this.isFreeSpin()) {
                this.gameData.spinButtonStateModel.change(SpinButtonState.ResumeWithFreeSpin);
            } else {
                this.gameData.stateModel.change(CascadingSlotState.None);
                this.onAutoSpinOff();
            }
        });

        this.gameData.on(CommonEvents.SETTLE_API_ERROR, (error) => {
            this.cacheApiError = error;
        });
    }

    private showBottomMessageOnGameState() {
        switch (this.gameData.stateModel.state) {
            case CascadingSlotState.Start_Round:
                this.bottomMessage.showMessages(RoundType.SPINNING);
                break;
            case CascadingSlotState.Spinning:
                break;
            case CascadingSlotState.Settled:
                if (this.totalFreeSpins === 0) {
                    this.bottomMessage.showMessages(RoundType.SETTLED);
                }
                break;
        }
    }

    private checkShowTopMessage() {
        const show = !this.tumbleWinView.isShowing && !this.totalMultiplierView.isShowing;
        if (show) {
            this.topMessage.showTopMessage();
        } else {
            this.topMessage.hideTopMessage();
        }
    }

    createFlyWinLabel(container: cc.Node, position: cc.Vec3, value: number) {
        const node = cc.instantiate(this.flyWinLabelPrefab);
        container.addChild(node);
        node.position = position;

        const label = node.getComponent(cc.Label);
        label.string = numberWithCommas(value, 2, false);
        node.scale = 0;
        node.opacity = 0;
        cc.tween(node)

            .parallel(
                cc
                    .tween()
                    .to(0.05, { opacity: 255 })
                    .delay(1)
                    .to(0.1, { opacity: 190 })
                    .to(0.1, { opacity: 120 })
                    .to(0.2, { opacity: 0 }, { easing: "sineOut" }),
                cc.tween().to(0.05, { scale: 1 }).to(0.1, { scale: 1.3 }).to(1.3, { scale: 0.9 }, { easing: "sineOut" }),
                cc.tween().by(0.15, { y: -10 }).by(1.3, { y: 60 }, { easing: "sineOut" })
            )
            .call(() => {
                node.destroy();
            })
            .start();
    }

    openHistory() {
        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(CascadingSlotGameHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.addDialog(dialog);
    }

    openGuide() {
        this.gameConfigs.coin = this.currCoinValue;
        this.gameConfigs.level = this.currBetLevel;
        super.openGuide();
    }

    initTotalBet(node: cc.Node) {
        this.miniBetControl = node.getComponent(CascadingTotalBet);
        this.checkExistNodeBet();
    }

    initBetControl(node: cc.Node) {
        this.betControl = node.getComponent(CascadingBetControl);
        this.checkExistNodeBet();
    }

    initTotalTumbleWin(node: cc.Node) {
        this.tumbleWinView = node.getComponent(TumbleWinView);
        this.tumbleWinView.showViewQuickly(false);
    }

    initTotalMultiplierView(node: cc.Node) {
        this.totalMultiplierView = node.getComponent(TotalMultiplierView);
        this.totalMultiplierView.showViewQuickly(false);
    }

    checkExistNodeBet() {
        if (this.miniBetControl && this.betControl) {
            this.betControl.gameId = this.gameId;
            this.miniBetControl.initData(this.betControl);
            this.betControl.showView(false);
        }
    }

    initFreeSpinView(node: cc.Node) {
        this.freeSpinView = node.getComponent(FreeSpinView);
        this.freeSpinView.showViewQuickly(false);
    }

    initShowTopMessage(node: cc.Node) {
        this.topMessage = node.getComponent(SlotGameTopMessage);
    }

    initTumbleList(node: cc.Node) {
        this.tumbleList = node.getComponent(CascadingSlotTumbleList);
    }

    onIngameMenuInitialized(node: cc.Node) {
        super.onIngameMenuInitialized(node);
        if (this.inGameMenu) {
            this.historyBtn = this.inGameMenu.expandableMenu.node.getChildByName("btn-history").getComponent(cc.Button);
        }
    }

    override async showEffectBigWin(betWin: number) {
        this.gameSound.playSound(CascadingSlotGameSound.BIG_WIN);

        const effect = cc.instantiate(this.effectBigWin);
        const callbackAnim = effect.getComponent(CallbackLoopAnimation);
        callbackAnim.setDuration(this.getCustomDuration("bigWin"));
        const bigWinAnimation = effect.getComponent(BigWinAnimation);

        if (this.isTurboMode()) {
            bigWinAnimation.setAmount(betWin, 0);
            callbackAnim.skipTouchToContinue();
        } else {
            bigWinAnimation
                .setAmountSlow(betWin, () => {
                    callbackAnim.closeLater();
                })
                .catch((reason) => console.log(reason));
        }

        callbackAnim.skipCallback = () => {
            bigWinAnimation.setAmount(betWin, 0);
        };

        await this.showEffect(effect);
    }

    async showEffectFreeSpins(count: number) {
        this.gameSound.playSound(CascadingSlotGameSound.FREE_SPIN);
        await super.showEffectFreeSpins(count);
    }

    setAllowChangeBet(allow: boolean) {
        if (this.miniBetControl) {
            this.miniBetControl.setAllowChangeBet(allow);
        }
    }

    updateButtonsInteract() {
        const state = this.gameData.stateModel.state;
        const spinButtonState = this.gameData.spinButtonStateModel.state;

        if (spinButtonState === SpinButtonState.FreeSpin) {
            this.trialToggle.interactable = false;
            this.setAllowChangeBet(false);
            this.enableSpinButton(false);
            if (!this.autoSpinToggle.isChecked) {
                this.autoSpinToggle.interactable = false;
            }
            return;
        }

        if (spinButtonState === SpinButtonState.AutoSpin) {
            this.trialToggle.interactable = false;
            this.setAllowChangeBet(false);
            this.enableSpinButton(false);
            this.autoSpinToggle.interactable = true;
            return;
        }

        if (spinButtonState === SpinButtonState.ResumeWithFreeSpin) {
            this.trialToggle.interactable = false;
            this.setAllowChangeBet(false);
            this.enableSpinButton(true);
            this.autoSpinToggle.interactable = false;
            return;
        }

        if (state === CascadingSlotState.Spinning || state === CascadingSlotState.Start_Round) {
            this.trialToggle.interactable = false;
            this.setAllowChangeBet(false);
            this.enableSpinButton(false);
            this.autoSpinToggle.interactable = false;
            return;
        }

        this.trialToggle.interactable = true;
        this.setAllowChangeBet(true);
        this.enableSpinButton(true);
        this.autoSpinToggle.interactable = !this.holdActionButton.isAutoAction && !this.isTrialMode;
    }

    protected enableSpinButton(value: boolean) {
        this.spinButton.spinButton.interactable = value;
        this.holdActionButton.interactable = value;
    }

    setTotalFreeSpins(count: number) {
        super.setTotalFreeSpins(count);
        this.gameData.uiModel.setFreeSpins(count);
    }

    onTurboModeChanged(toggle: cc.Toggle) {
        super.onTurboModeChanged(toggle);
        this.updateBottomMessageStatus();
    }
}
