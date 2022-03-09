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

    private isAutoSpin = false;
    private isSpinning = false;

    async onSpinClick() {
        this.spin();
    }

    spin() {
        const data = [
            {
                symbols: [
                    [0, 1, 2],
                    [0, 1, 4],
                    [0, 1, 3],
                    [0, 1, 5],
                    [0, 1, 6]
                ],
                removedSymbols: [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ]
            },
            {
                symbols: [
                    [7, 6, 6],
                    [8, 8, 4],
                    [0, 1, 3],
                    [0, 1, 5],
                    [0, 1, 6]
                ],
                removedSymbols: [
                    [0, 1, 0],
                    [0, 1, 0],
                    [1, 0, 0],
                    [1, 1, 0],
                    [1, 1, 1]
                ]
            },
            {
                symbols: [
                    [0, 1, 2],
                    [0, 1, 4],
                    [0, 1, 3],
                    [0, 1, 5],
                    [0, 1, 6]
                ],
                removedSymbols: [
                    [0, 1, 0],
                    [0, 1, 1],
                    [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]
                ]
            }
        ];
        this.board.spinGenrations(data);
    }

    protected onLoad(): void {
        this.registerKeyEvents();
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
        switch (event.keyCode) {
            case cc.macro.KEY.space:
                this.enableAutoSpin();
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.space:
                this.disableAutoSpin();
                break;
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
