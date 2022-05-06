import { result } from "lodash";

import { handleSettle } from "../actions/CascadingSlotSettlementAction";
import { CascadingSlotFinishData, CascadingSlotFinishModel } from "../models/CascadingSlotFinishModel";
import CascadingSlotGameData from "../models/CascadingSlotGameData";
import CascadeSlotBoard from "./CascadeSlotBoard";

const { ccclass, property } = cc._decorator;

@ccclass
// export default class CascadingSlotBase extends NewGameRoomBase {
export default class CascadingSlotBase extends cc.Component {
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

    protected gameData: CascadingSlotGameData<void>;
    protected isAutoSpin = false;
    protected isSpinning = false;

    async onSpinClick() {
        this.spin();
    }

    spin() {
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

    onLoad() {
        // super.onLoad();
        this.registerKeyEvents();
    }

    initGameDataEvents() {
        this.gameData = new CascadingSlotGameData(this);

        this.gameData.finishModel.on(CascadingSlotFinishModel.Events.SETTLE, handleSettle(this));
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
        if (event.keyCode === cc.macro.KEY.space || event.keyCode === cc.macro.KEY.enter) {
            this.enableAutoSpin();
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.space || event.keyCode === cc.macro.KEY.enter) {
            this.disableAutoSpin();
        }
    }

    enableAutoSpin() {
        if (this.isAutoSpin) {
            return;
        }

        this.isAutoSpin = true;
        this.spin();
        this.schedule(this.onScheduleAutoSpin, 1, cc.macro.REPEAT_FOREVER);
    }

    disableAutoSpin() {
        this.isAutoSpin = false;

        this.unschedule(this.onScheduleAutoSpin);
    }

    onScheduleAutoSpin() {
        if (this.isSpinning) {
            return;
        }

        if (!this.isAutoSpin) {
            this.disableAutoSpin();
            return;
        }

        this.spin();
    }
}
