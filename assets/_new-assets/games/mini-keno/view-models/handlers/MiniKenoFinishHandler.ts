import TypingEffectLabel from "../../../../common/TypingEffectLabel";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import MiniKeno from "../MiniKeno";
import MiniKenoStatusHandler from "./MiniKenoStatusHandler";

export default class MiniKenoFinishHandler extends GameBaseFinishHandler {
    private static readonly GETTING_RESULT_MESSAGE = "Đang xổ kết quả ...";
    private static readonly STOP_PLACE_BET_MESSAGE = "Dừng nhận cược.";

    constructor(protected readonly main: MiniKeno) {
        super(main, main.isMiniKeno ? 1.5 : 3);
    }

    public handleFinishData(dataFinish, onFinishHanlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHanlingData);
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
        this.handleResult(onFinishHanlingData);
    }

    public showResultWithoutAnimation() {
        this.updateRoundHistory();

        const lastLog = this.main.currentDataLogs[0];
        this.main.roundResult.setData(lastLog.result, lastLog.settlementResult);
        this.main.highlightWonItem(lastLog.settlementResult, { isAnimated: true, showWinningEffect: true });
        this.main.roundResult.showResult(false);
        this.main.finishShowResult = true;
    }

    protected handleResult(onFinishHanlingData: () => void) {
        if (cc.RedT.GAME_IS_SHOWED) {
            const typingEffect = this.main.stopBetWarning.children[0].getComponent(TypingEffectLabel);

            if (typingEffect) {
                typingEffect.setText(MiniKenoFinishHandler.GETTING_RESULT_MESSAGE);
            }

            const lastLog = this.main.currentDataLogs[0];
            this.main.roundResult.setData(lastLog.result, lastLog.settlementResult);
            this.main.resetWinningBetItems();
            this.main.roundResult.showResult(true, this.playResultAnimationTime, () => {
                this.main.highlightWonItem(lastLog.settlementResult, { isAnimated: true, showWinningEffect: true });
                this.main.updateRoundHistory();
                this.showBetStatus();
                onFinishHanlingData();
                this.main.stopBetWarning.active = false;
            });
        }
    }

    private updateRoundHistory() {
        this.main.updateRoundHistory();
        this.main.stopBetWarning.active = false;
        const typingEffect = this.main.stopBetWarning.children[0].getComponent(TypingEffectLabel);

        if (typingEffect) {
            typingEffect.setText(MiniKenoFinishHandler.STOP_PLACE_BET_MESSAGE);
        }
    }

    protected showBetStatus() {
        const statusData = this.main.statusHandler.currentStatusData;

        if (statusData) {
            const miniStatuHander = this.main.statusHandler as MiniKenoStatusHandler;
            miniStatuHander.showStatus(statusData.win, statusData.bet);

            if (statusData.win) {
                this.main.statusCallback(this.main.kenoType, this.main.roundId - 1, statusData.bet);
            }
        }
    }
}
