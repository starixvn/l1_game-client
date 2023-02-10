const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotBottomArea extends cc.Component {
    @property(cc.Toggle)
    autoSpinToggle: cc.Toggle = null;

    @property(cc.Toggle)
    turboToggle: cc.Toggle = null;

    @property(cc.Button)
    stakeButton: cc.Button = null;

    @property(cc.ToggleContainer)
    stakeContainer: cc.ToggleContainer = null;

    @property(cc.Button)
    lineButton: cc.Button = null;

    @property(cc.Label)
    stakeLabel: cc.Label = null;

    @property(cc.Label)
    lineLabel: cc.Label = null;

    @property(cc.Label)
    totalBet: cc.Label = null;

    @property(cc.Label)
    winningBet: cc.Label = null;

    @property(cc.Node)
    winningBetEffect: cc.Node = null;

    onClickListener = {
        onStakeButtonClick: () => {},
        onLineSelectionClick: () => {},
        onAutoSpinChanged: () => {},
        onHideStakeContainer: () => {},
        onTurboModeChanged: (toggle) => {},
        onStakeQuickChange: (event) => {},
        onStakeToggleChanged: (event, param) => {}
    };

    onStakeButtonClick() {
        this.onClickListener.onStakeButtonClick();
    }

    onLineSelectionClick() {
        this.onClickListener.onLineSelectionClick();
    }

    onAutoSpinChanged() {
        this.onClickListener.onAutoSpinChanged();
    }

    onTurboModeChanged(toggle: cc.Toggle) {
        this.onClickListener.onTurboModeChanged(toggle);
    }

    onStakeQuickChange(event: cc.Event) {
        this.onClickListener.onStakeQuickChange(event);
    }

    onStakeToggleChanged(event: cc.Event, param: string) {
        this.onClickListener.onStakeToggleChanged(event, param);
    }

    onHideStakeContainer() {
        this.onClickListener.onHideStakeContainer();
    }
}
