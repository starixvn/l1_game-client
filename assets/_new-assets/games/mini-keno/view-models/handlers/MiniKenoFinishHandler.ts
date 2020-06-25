import MiniKeno from "../MiniKeno";
import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import MiniKenoStatusHandler from "./MiniKenoStatusHandler";
import TypingEffectLabel from "../../../../common/TypingEffectLabel";

export default class MiniKenoFinishHandler extends GameBaseFinishHandler {
    constructor(protected readonly main: MiniKeno) {
        super(main, main.isMiniKeno ? 2 : 4);
    }

    handleFinishData(dataFinish, onFinishHanlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHanlingData);
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
        this.handleResult(onFinishHanlingData);
    }

    protected handleResult(onFinishHanlingData: () => void) {
        if (cc.RedT.GAME_IS_SHOWED) {
            cc.tween({})
                .call(() => {
                    this.playResultAnimation();
                })
                .delay(this.playResultAnimationTime)
                .call(() => onFinishHanlingData())
                .start();
        }
    }

    private playResultAnimation() {
        const typingEffect = this.main.stopBetWarning.children[0].getComponent(TypingEffectLabel);
        if (typingEffect) {
            typingEffect.setText("Đang xổ kết quả ...");
        }
        cc.tween({})
            .delay(1)
            .call(() => { this.main.stopBetWarning.active = false; })
            .start();

        const lastLog = this.main.currentDataLogs[0];
        this.main.roundResult.setData(lastLog.result, lastLog.settlementResult, lastLog.roundId, lastLog.time);
        this.main.roundResult.show(true, this.playResultAnimationTime, () => {
            this.updateRoundHistory();
            this.showBetStatus();
        });
    }

    showResult() {
        this.updateRoundHistory();

        if (this.main.currentDataLogs.length > 0) {
            const lastLog = this.main.currentDataLogs[0];
            this.main.roundResult.setData(lastLog.result, lastLog.settlementResult, lastLog.roundId, lastLog.time);
            this.main.roundResult.show(false);
        }
    }

    private updateRoundHistory() {
        this.main.updateRoundHistory();
        this.main.stopBetWarning.active = false;
        const typingEffect = this.main.stopBetWarning.children[0].getComponent(TypingEffectLabel);
        if (typingEffect) {
            typingEffect.setText("Dừng nhận cược");
        }

        this.main.highlightWonItem(this.main.currentDataLogs[0].settlementResult, false, true);
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
