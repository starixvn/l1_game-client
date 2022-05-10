import { result } from "lodash";

import AudioManager from "../../../common/audio/AudioManager";
import { events } from "../../_new/connection/SocketIOConnection";
import FeatureSlotGameBase, { RoundType } from "../../_slotgame_base/FeatureSlotGameBase";
import HoldActionButton from "../../_slotgame_base/HoldActionButton";
import { handleSettle } from "../actions/CascadingSlotSettlementAction";
import { CascadingSlotFinishData, CascadingSlotFinishModel } from "../models/CascadingSlotFinishModel";
import CascadingSlotGameData from "../models/CascadingSlotGameData";
import CascadeSlotBoard from "./CascadeSlotBoard";
import { CascadingSlotBaseConfig } from "./CascadingSlotBaseConfig";

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

    //#endregion

    @property(CascadeSlotBoard)
    board: CascadeSlotBoard = null;

    @property(HoldActionButton)
    holdActionButton: HoldActionButton = null;

    protected gameData: CascadingSlotGameData<void>;
    protected cascadingSlotConfig: CascadingSlotBaseConfig;
    protected isAutoSpin = false;
    protected isSpinning = false;

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
            result: "8,8,8,3,8,9,8,8,8,9,5,9,8,1,1,9,5,8,1,7,5,6,7,8,5,7,7,6,7,7", // 30 items on board
            win: 30,
            bigWin: true,
            freeSpins: 0,
            tumbles: [
                {
                    icons: {},
                    win: 30,
                    settlement: {
                        explode: "8,8,8,,8,,8,8,8,,,,8,,,,,8,,,,,,8,,,,,,", // 30 icons
                        new: "4,5,9,,1,2,3,6,9,,,3,1,,,,,,,,,,,,,,,,," // 30 icons
                    },
                    result: ""
                }
            ]
        };
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
    }

    protected initCascadingSlotConfig() {
        this.cascadingSlotConfig = new CascadingSlotBaseConfig();
    }

    protected initGameDataEvents() {
        this.gameData = new CascadingSlotGameData(this);

        this.gameData.finishModel.on(CascadingSlotFinishModel.Events.SETTLE, handleSettle(this));
    }
}
