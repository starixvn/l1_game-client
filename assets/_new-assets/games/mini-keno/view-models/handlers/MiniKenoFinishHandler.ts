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

        var resultNumbers = this.main.currentDataLogs[0].result;
        this.main.roundResult.setData(resultNumbers, this.main.currentDataLogs[0].settlementResult);
        this.main.roundResult.show(true, this.playResultAnimationTime, () => {
            this.showResult();
        });
    }

    showResult() {
        this.main.updateRoundHistory();
        this.main.stopBetWarning.active = false;
        const typingEffect = this.main.stopBetWarning.children[0].getComponent(TypingEffectLabel);
        if (typingEffect) {
            typingEffect.setText("Dừng nhận cược");
        }

        const statusData = this.main.statusHandler.currentStatusData;

        if (statusData) {
            const miniStatuHander = this.main.statusHandler as MiniKenoStatusHandler;
            miniStatuHander.showStatus(statusData.win, statusData.bet);
            if (statusData.win) {
                this.main.statusCallback(this.main.kenoType, this.main.roundId - 1, statusData.bet);
            }
        }

        if (this.main.currentDataLogs.length > 0) {
            this.main.roundResult.setData(this.main.currentDataLogs[0].result, this.main.currentDataLogs[0].settlementResult);
            this.main.roundResult.show(false);
            this.main.highlightWonItem(this.main.currentDataLogs[0].settlementResult, false);
        }
    }
}
