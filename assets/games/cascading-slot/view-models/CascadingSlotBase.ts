import AudioManager from "../../../common/audio/AudioManager";
import CallbackLoopAnimation from "../../../common/CallbackLoopAnimation";
import ExpandableMenu from "../../../common/expandable-menu/view-models/ExpandableMenu";
import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import { getTrialSocket } from "../../../common/helpers/UrlHelper";
import SocketIOConnection, { events } from "../../_new/connection/SocketIOConnection";
import BigWinAnimation from "../../_slotgame_base/BigWinAnimation";
import FeatureSlotGameBase from "../../_slotgame_base/FeatureSlotGameBase";
import SlotGameBottomMessage, { RoundType } from "../../_slotgame_base/SlotGameBottomMessage";
import SlotGameTopMessage from "../../_slotgame_base/SlotGameTopMessage";
import { HandleBetControl } from "../actions/CascadingSlotConfigAction";
import { handleSettle } from "../actions/CascadingSlotSettlementAction";
import { CascadingSlotFinishData, CascadingSlotFinishModel } from "../models/CascadingSlotFinishModel";
import CascadingSlotGameData from "../models/CascadingSlotGameData";
import { CascadingSlotState, CascadingSlotStateModel } from "../models/CascadingSlotStateModel";
import { CascadingSlotTrialModel } from "../models/CascadingSlotTrialModel";
import CascadingUIModel from "../models/CascadingUIModel";
import SpinButtonStateModel, { SpinButtonState } from "../models/SpinButtonStateModel";
import { CascadingSlotConfigModel } from "./../models/CascadingSlotConfigModel";
import CascadeSlotBoard from "./CascadeSlotBoard";
import CascadingBetControl from "./CascadingBetControl";
import { CascadingSlotBaseConfig } from "./CascadingSlotBaseConfig";
import CascadingSlotGameHistory from "./CascadingSlotGameHistory";
import CascadingSlotMascot from "./CascadingSlotMascot";
import CascadingSlotTumbleList from "./CascadingSlotTumbleList";
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

    @property(ExpandableMenu)
    expandableMenu: ExpandableMenu = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    betControlPrefab: cc.Prefab = null;

    //#endregion

    @property(CascadeSlotBoard)
    board: CascadeSlotBoard = null;

    @property(cc.Label)
    totalWinLabel: cc.Label = null;

    @property(cc.Label)
    totalBetLabel: cc.Label = null;

    @property(TumbleWinView)
    tumbleWinView: TumbleWinView = null;

    @property(TotalMultiplierView)
    totalMultiplierView: TotalMultiplierView = null;

    @property(cc.Prefab)
    flyWinLabelPrefab: cc.Prefab = null;

    public gameData: CascadingSlotGameData<void>;
    protected cascadingSlotConfig: CascadingSlotBaseConfig;
    protected isAutoSpin = false;
    public processingSettlement = false;
    public betControl: CascadingBetControl;
    public freeSpinView: FreeSpinView;
    public mascot: CascadingSlotMascot;
    public tumbleList: CascadingSlotTumbleList;
    public isTrialMode = false;
    public trialUserBalance: number;

    bottomMessage: SlotGameBottomMessage = null;
    topMessage: SlotGameTopMessage = null;
    protected isOpenBetControl = false;
    protected trialConnection: SocketIOConnection;

    async onSpinClick() {
        AudioManager.getInstance().playClick();
        this.spin();
        // this.test();
    }

    initTrialConnection() {
        if (!this.trialConnection) {
            const socketUri = getTrialSocket(this.gameId);
            const socket = this.currentMiniPanel.openSocketByUri(this.gameId, socketUri);
            this.trialConnection = new SocketIOConnection();
            this.trialConnection.setSocket(socket, this.gameName);
            this.initGameEvents(socket);
        }
    }

    onDestroy() {
        this.trialConnection && this.trialConnection.close();
        super.onDestroy();
    }

    registerTrialMode() {
        this.trialConnection.emit("inGame");
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

    onTrialModeChanged(toggle: cc.Toggle) {
        const checked = toggle.isChecked;
        this.isTrialMode = checked;
        if (checked) {
            this.initTrialConnection();
            this.scheduleOnce(this.registerTrialMode, 1);
        } else {
            this.unschedule(this.registerTrialMode);
            this.registerViewGame();
        }
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

    test() {
        const data: CascadingSlotFinishData = {
            roundId: 183704,
            result: "0,8,3,2,6,1,0,0,0,4,5,7,5,5,2,1,3,4,0,2,8,2,2,0,3,2,7,2,2,0",
            win: 20,
            bigWin: false,
            freeSpins: 0,
            totalFreeSpins: 0,
            tumbles: [
                {
                    icons: {
                        "2": {
                            count: 8,
                            odds: 15,
                            win: 15
                        }
                    },
                    win: 15,
                    result: "1,0,8,3,6,1,0,0,0,4,4,5,7,5,5,9,1,3,4,0,0,2,8,0,3,7,3,1,7,0",
                    settlement: {
                        explode: [
                            -1, -1, -1, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, -1, 2, -1, 2, 2, -1, -1, 2, -1, 2, 2, -1
                        ],
                        new: [
                            1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4, -1, -1, -1, -1, 9, -1, -1, -1, -1, 0, 2, -1, -1, -1, 7, 3, 1, -1, -1
                        ]
                    },
                    multipliers: []
                },
                {
                    icons: {
                        "0": {
                            count: 8,
                            odds: 5,
                            win: 5
                        }
                    },
                    win: 5,
                    result: "2,1,8,3,6,3,4,7,1,4,4,5,7,5,5,4,9,1,3,4,6,0,2,8,3,3,7,3,1,7",
                    settlement: {
                        explode: [
                            -1, 0, -1, -1, -1, -1, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, -1, -1, 0, -1, -1, -1, -1, -1, 0
                        ],
                        new: [
                            2, -1, -1, -1, -1, 3, 4, 7, -1, -1, -1, -1, -1, -1, -1, 4, -1, -1, -1, -1, 6, 0, -1, -1, -1, 3, -1, -1, -1, -1
                        ]
                    },
                    multipliers: []
                },
                {
                    icons: {},
                    win: 0,
                    result: "2,1,8,3,6,3,4,7,1,4,4,5,7,5,5,4,9,1,3,4,6,0,2,8,3,3,7,3,1,7",
                    settlement: {},
                    multipliers: []
                }
            ],
            multiplier: 0,
            totalMultiplier: 0
        };
        this.tumbleWinView.showView(false);
        handleSettle(this)(data);
    }

    spin(): boolean {
        let success = false;
        if (!this.isReadyBet() || !this.checkAvailableBalance() || this.processingSettlement) {
            return success;
        }
        const autoSpinAction = this.holdActionButton.isAutoAction;
        if (this.waitingProcessing && !autoSpinAction) {
            this.showProcessingWarning(true);
            return success;
        }
        this.lockBet();
        this.gameData.stateModel.change(CascadingSlotState.New);
        this.gameData.placeBetModel.updateFreeSpin(this.isFreeSpin());
        const connection = this.isTrialMode ? this.trialConnection : this.connection;
        connection.emit(events.bet, this.gameData.placeBetModel.data);
        success = true;
        return success;
    }

    getCustomDuration(key: string): number {
        const config = this.isTurboMode() ? this.cascadingSlotConfig.turbo : this.cascadingSlotConfig.normal;
        return config[key];
    }

    isTurboMode(): boolean {
        return this.turboToggle.isChecked || this.holdActionButton.isAutoAction;
    }

    onLoad() {
        super.onLoad();
        this.initGameDataEvents();
        this.initCascadingSlotConfig();
    }

    start() {
        super.start();
        this.gameData.uiModel.resetNewRound();
    }

    protected initCascadingSlotConfig() {
        this.cascadingSlotConfig = new CascadingSlotBaseConfig();
    }

    protected initGameDataEvents() {
        this.gameData = new CascadingSlotGameData(this);

        this.gameData.finishModel.on(CascadingSlotFinishModel.Events.SETTLE, (data: CascadingSlotFinishData) => {
            try {
                handleSettle(this)(data);
            } catch (err) {
                console.warn(err);
            }
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.GET_TUMBLE, () => {
            this.mascot.playAnimationForTumble();
            this.bottomMessage.showMessageDisplay(RoundType.TUMBLEWIN, false);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_TOTAL_WIN, (value: number) => {
            GameUtils.floatToNumber(this.totalWinLabel, value, 0.5);
            this.tumbleWinView.setTotalWinValue(value);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_TOTAL_BET, (value: number) => {
            this.totalBetLabel.string = value.toString();
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_TUMBLE_WIN, (value: number) => {
            this.topMessage.hideTopMessage();
            GameUtils.floatToNumber(this.totalWinLabel, value, 0.5);
            this.tumbleWinView.setTumbleWinValue(value, true);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_MULTIPLIER, (value: number) => {
            this.tumbleWinView.setMultiplier(value);
            this.topMessage.hideTopMessage();
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_TOTAL_MULTIPLIER, (value: number) => {
            this.totalMultiplierView.setValue(value, true);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.SET_FREESPINS, (value: number) => {
            this.totalFreeSpins = value;
            this.freeSpinView.showView(value > 0);
            this.freeSpinView.setValue(value);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.INCREASE_FREESPINS, (value: number) => {
            this.freeSpinView.setValue(value);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.RESET_NEW_ROUND, (value: CascadingUIModel) => {
            this.totalWinLabel.string = "0";
            this.topMessage.showTopMessage();
            this.tumbleWinView.showView(false, true);
        });

        this.gameData.gameConfig.on(CascadingSlotConfigModel.Events.CHANGE, (data: any) => {
            HandleBetControl(this)(data);
        });

        this.gameData.spinButtonStateModel.on(SpinButtonStateModel.Events.CHANGE, (state: SpinButtonState) => {
            switch (state) {
                case SpinButtonState.Normal:
                    this.spinButton.showNormalMode();
                    break;
                case SpinButtonState.AutoSpin:
                    this.spinButton.showAutoSpinMode();
                    break;
            }
        });

        this.gameData.stateModel.on(CascadingSlotStateModel.Events.CHANGE, (state) => {
            switch (state) {
                case CascadingSlotState.New:
                    this.tumbleList.clear();
                    this.gameData.uiModel.resetNewRound();
                    this.bottomMessage.showMessageDisplay(RoundType.SPINNING, this.isTurboMode());
                    if (!this.isFreeSpin()) {
                        this.consumeAutoSpinCount();
                    }
                    //TODO: stop tween for result
                    break;
                case CascadingSlotState.Spinning:
                    this.disabledButtons();
                    break;
                case CascadingSlotState.Settled:
                    this.bottomMessage.showMessageDisplay(RoundType.SETTLED, this.isTurboMode());
                    break;
            }
        });

        this.gameData.trialModel.on(CascadingSlotTrialModel.Events.CHANGE_USER_BALANCE, (value) => {
            this.trialUserBalance = value;
            this.userBalance.string = numberWithCommas(value);
        });
    }

    createFlyWinLabel(container: cc.Node, position: cc.Vec3, value: number) {
        const node = cc.instantiate(this.flyWinLabelPrefab);
        container.addChild(node);
        node.position = position;

        const label = node.getComponent(cc.Label);
        label.string = numberWithCommas(value);

        cc.tween(node)
            .parallel(
                cc.tween().to(0.2, { scale: 1.1 }, { easing: "sineOut" }).to(0.3, { scale: 1 }, { easing: "sineOut" }),
                cc.tween().by(0.5, { y: 100 })
            )
            .to(0.2, { opacity: 0 })
            .call(() => {
                node.destroy();
            })
            .start();
    }

    onClickShowHistory() {
        AudioManager.getInstance().playClick();
        this.expandableMenu.collapseMenu();

        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(CascadingSlotGameHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.addDialog(dialog);
    }

    initBetControl(node: cc.Node) {
        this.betControl = node.getComponent(CascadingBetControl);
        this.betControl.showView(false, () => {
            this.onClickOpenBetControl();
        });
    }

    onClickOpenBetControl() {
        this.betControl.showView(!this.isOpenBetControl, () => {
            this.onClickOpenBetControl();
        });
        this.isOpenBetControl = !this.isOpenBetControl;
    }

    initFreeSpinView(node: cc.Node) {
        this.freeSpinView = node.getComponent(FreeSpinView);
        this.freeSpinView.showView(false, true);
    }

    initShowBottomMessage(node: cc.Node) {
        this.bottomMessage = node.getComponent(SlotGameBottomMessage);
    }

    initShowTopMessage(node: cc.Node) {
        this.topMessage = node.getComponent(SlotGameTopMessage);
    }

    initMascot(node: cc.Node) {
        this.mascot = node.getComponent(CascadingSlotMascot);
    }

    initTumbleList(node: cc.Node) {
        this.tumbleList = node.getComponent(CascadingSlotTumbleList);
    }

    override async showEffectBigWin(betWin: number) {
        const effect = cc.instantiate(this.effectBigWin);
        const callbackAnim = effect.getComponent(CallbackLoopAnimation);
        const bigWinAnimation = effect.getComponent(BigWinAnimation);
        bigWinAnimation.setAmountSlow(betWin);

        callbackAnim.skipCallback = () => {
            bigWinAnimation.setAmount(betWin, 0);
        };

        await this.showEffect(effect);
    }
}
