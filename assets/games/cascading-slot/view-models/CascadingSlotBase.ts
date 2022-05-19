import AudioManager from "../../../common/audio/AudioManager";
import ExpandableMenu from "../../../common/expandable-menu/view-models/ExpandableMenu";
import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import { events } from "../../_new/connection/SocketIOConnection";
import FeatureSlotGameBase, { RoundType } from "../../_slotgame_base/FeatureSlotGameBase";
import HoldActionButton from "../../_slotgame_base/HoldActionButton";
import { handleBetControl, handleTotalBet } from "../actions/CascadingSlotConfigAction";
import { handleSettle } from "../actions/CascadingSlotSettlementAction";
import { CascadingSlotFinishData, CascadingSlotFinishModel } from "../models/CascadingSlotFinishModel";
import CascadingSlotGameData from "../models/CascadingSlotGameData";
import CascadingUIModel from "../models/CascadingUIModel";
import { CascadingSlotConfigModel } from "./../models/CascadingSlotConfigModel";
import CascadeSlotBoard from "./CascadeSlotBoard";
import CascadingBetControl from "./CascadingBetControl";
import { CascadingSlotBaseConfig } from "./CascadingSlotBaseConfig";
import CascadingSlotGameHistory from "./CascadingSlotGameHistory";
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

    @property(HoldActionButton)
    holdActionButton: HoldActionButton = null;

    @property(cc.Label)
    totalWinLabel: cc.Label = null;

    @property(TumbleWinView)
    tumbleWinView: TumbleWinView = null;

    @property(TotalMultiplierView)
    totalMultiplierView: TotalMultiplierView = null;

    @property(cc.Prefab)
    flyWinLabelPrefab: cc.Prefab = null;

    public gameData: CascadingSlotGameData<void>;
    protected cascadingSlotConfig: CascadingSlotBaseConfig;
    protected isAutoSpin = false;
    protected isSpinning = false;
    public betControl: CascadingBetControl;
    public freeSpinView: FreeSpinView;

    async onSpinClick() {
        AudioManager.getInstance().playClick();
        this.spin();
    }

    getCurrentTotalBet(): number {
        return this.gameData.placeBetModel.data.totalBet;
    }

    test() {
        const data: CascadingSlotFinishData = {
            roundId: 0,
            totalMultiplier: 10,
            result: "8,8,8,3,8,9,8,8,8,9,5,10,8,1,1,9,5,8,1,7,5,6,7,8,5,7,7,6,7,7", // 30 items on board
            win: 30,
            bigWin: true,
            freeSpins: 0,
            isFreeSpin: true,
            tumbles: [
                {
                    icons: { "8": { win: 100, count: 10 } },
                    win: 30,
                    settlement: {
                        explode: "8,8,8,,8,,8,8,8,,,,8,,,,,8,,,,,,8,,,,,,", // 30 icons
                        new: "4,5,9,,10,2,3,6,9,,,10,1,,,,,,,,,,,,,,,,," // 30 icons
                    },
                    result: ""
                }
            ],
            m: [5, 2, 3]
        };
        this.tumbleWinView.showView(false);
        handleSettle(this)(data);
    }

    spin(): boolean {
        let success = false;
        if (!this.isReadyBet() || !this.checkAvailableBalance()) {
            return success;
        }
        const autoSpinAction = this.holdActionButton.isAutoAction;
        if (this.waitingProcessing && !autoSpinAction) {
            this.showProcessingWarning(true);
            return success;
        }
        this.tumbleWinView.showView(false);
        this.showMessageDisplay(RoundType.SPINNING);
        //TODO: stop tween for result
        this.lockBet();
        //TODO: cosume auto spin count
        this.connection.emit(events.bet, this.gameData.placeBetModel.data);
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
        this.initCascadingSlotConfig();
        this.initGameDataEvents();
        // this.initBetControl();
    }

    protected initCascadingSlotConfig() {
        this.cascadingSlotConfig = new CascadingSlotBaseConfig();
    }

    protected initGameDataEvents() {
        this.gameData = new CascadingSlotGameData(this);

        this.gameData.finishModel.on(CascadingSlotFinishModel.Events.SETTLE, handleSettle(this));

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_TOTAL_WIN, (value: number) => {
            GameUtils.floatToNumber(this.totalWinLabel, value, 0.5);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_TUMBLE_WIN, (value: number) => {
            this.tumbleWinView.setTumbleWinValue(value, true);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_MULTIPLIER, (value: number) => {
            this.tumbleWinView.setMultiplier(value);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.CHANGE_TOTAL_MULTIPLIER, (value: number) => {
            this.totalMultiplierView.setValue(value, true);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.SET_FREESPINS, (value: number) => {
            this.freeSpinView.showView(true);
            this.freeSpinView.setValue(value);
        });

        this.gameData.uiModel.on(CascadingUIModel.Events.INCREASE_FREESPINS, (value: number) => {
            this.freeSpinView.setValue(value);
        });

        this.gameData.gameConfig.on(CascadingSlotConfigModel.Events.CHANGE, () => {
            handleBetControl(this);
            handleTotalBet(this);
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

    initBetControl() {
        if (!this.betControlPrefab) {
            return;
        }
        const dialog = cc.instantiate(this.betControlPrefab);
        this.betControl = dialog.getComponent(CascadingBetControl);
        this.currentMiniPanel.addDialog(dialog);
    }

    initFreeSpinView(node: cc.Node) {
        this.freeSpinView = node.getComponent(FreeSpinView);
        this.freeSpinView.showView(false, true);
    }
}
