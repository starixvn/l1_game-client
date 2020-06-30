import MiniKeno from "../MiniKeno";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import MiniKenoStatusHandler from "./MiniKenoStatusHandler";
import TypingEffectLabel from "../../../../common/TypingEffectLabel";
import { KenoType } from "../KenoUtils";

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

        if (this.main.currentDataLogs.length > 0) {
            const lastLog = this.main.currentDataLogs[0];
            this.main.roundResult.setData(lastLog.result, lastLog.settlementResult, lastLog.roundId,
                this.main.kenoType == KenoType.ProViet ? lastLog.time : null);
            this.main.roundResult.show(false);
            this.main.highlightWonItem(lastLog.settlementResult, false, true);
        }
    }

    protected handleResult(onFinishHanlingData: () => void) {
        if (cc.RedT.GAME_IS_SHOWED) {
            const typingEffect = this.main.stopBetWarning.children[0].getComponent(TypingEffectLabel);

            if (typingEffect) {
                typingEffect.setText(MiniKenoFinishHandler.GETTING_RESULT_MESSAGE);
            }


            const lastLog = this.main.currentDataLogs[0];
            this.main.roundResult.setData(lastLog.result, lastLog.settlementResult, lastLog.roundId, lastLog.time);
            this.main.resetHighlightBetItems();
            this.main.roundResult.show(true, this.playResultAnimationTime, () => {
                this.main.highlightWonItem(lastLog.settlementResult, true, true);
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

    private showBetStatus() {
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
