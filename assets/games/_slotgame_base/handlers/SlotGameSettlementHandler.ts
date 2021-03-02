import DataHandler from "../../_base/handlers/DataHandler";
import SlotGameBase, { LineData } from "../SlotGameBase";

export default class SlotGameSettlementHandler implements DataHandler {
    constructor(protected readonly main: SlotGameBase) {}

    handle(data: any): boolean {
        if (data.apiError) {
            this.handleApiError(data);
        }

        if (data.bonuses) {
            this.handleBonuses(data.bonuses);
        }

        if (data.jackpotError) {
            this.main.showMiniWarning(data.jackpotError);
        }

        if (data.finish) {
            this.handleFinish(data.finish);
        }
        return true;
    }

    handleApiError(data: any) {
        const error = data.apiError;
        const gameId = error.gameTypeId;
        if (gameId === this.main.gameId && this.main.waitingSpinResult && !data.endBet) {
            this.main.cacheApiError = error;
        } else {
            this.main.currentMiniPanel.showErrorNotice(error);
            this.main.resetStateButtons();
        }
    }

    async handleBonuses(bonuses: any) {
        this.main.deactiveButtons();
        this.main.isAnimatingResult = true;
        this.updateFreeSpinCount();

        const { roundId, bonus, result } = bonuses;
        this.main.setGameRound(roundId);

        await this.main.setDataAndSpin(result);
        await this.handleBonus(bonus);
    }

    updateFreeSpinCount() {
        this.main.setTotalFreeSpins(this.main.totalFreeSpins - 1);
        this.main.updateDisplaySpinButtons();
    }

    async handleFinish(finish: any) {
        this.main.deactiveButtons();
        this.main.waitingSpinResult = false;
        this.main.textFreeSpinNode.active = false;
        this.main.isAnimatingResult = true;

        this.main.showProcessingWarning(false);
        const { result, settlementResult, betWin, bigWin, roundId, totalOfFreeSpins, betByFreeSpin } = finish;
        const { winningLines, jackpot, bonus, freeSpins } = settlementResult;

        this.main.setGameRound(roundId);
        if (bonus.count > 0) {
            await this.waitingHandleBonus();
        } else {
            this.updateFreeSpinCount();
            await this.main.setDataAndSpin(result);
        }

        await this.handleJackpot(jackpot);
        this.main.showWinningItems(winningLines);
        if (bonus.count > 0) {
            this.main.showHighlightSpecialSymbols(+bonus.symbol);
        }
        if (freeSpins.count > 0) {
            this.main.showHighlightSpecialSymbols(+freeSpins.symbol);
        }

        this.main.setTotalFreeSpins(totalOfFreeSpins);
        const needWaitEffect = bigWin || freeSpins.count > 0 || betByFreeSpin;
        if (!needWaitEffect) {
            this.main.updateDisplayFreeSpinNode();
            this.finishAnimationResult();
        }
        if (betWin === 0) {
            this.main.updateWinningBetLabel(betWin);
        }
        this.handlePayline(jackpot, betWin, winningLines, bigWin, freeSpins);
    }

    waitingHandleBonus(): Promise<void> {
        return new Promise((resolve, reject) => {
            cc.tween(this.main)
                .delay(this.main.slotGameConfigs.showTotalBonusAmountDuration) //show total bonus in bonus dialog
                .call(resolve)
                .start();
        });
    }

    handleJackpot(jackpot: any): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if (jackpot) {
                this.main.showLine(jackpot.winningLine + 1);
                this.main.slotBoard.showWinningEffect(jackpot.positions, jackpot.symbol);
                await this.main.showEffectJackpot(jackpot.winningAmount);
            }
            resolve();
        });
    }

    finishAnimationResult() {
        this.main.isAnimatingResult = false;
        this.main.activeButtons();
    }

    showWinningLines(betWin: number, bigWin: boolean, jackpot: any, winningLines: LineData[], delayTime: number) {
        if (betWin > 0) {
            if (!bigWin) {
                this.main.showWinningBet(betWin);
            }
        }

        const lines: LineData[] = [];
        if (jackpot) {
            lines.push({
                payline: jackpot.winningLine,
                positions: jackpot.positions,
                symbol: jackpot.symbol
            });
        }
        lines.push(...winningLines);
        this.main.showWinningLines(lines, delayTime);
    }

    handlePayline(jackpot: any, betWin: number, winningLines: LineData[], bigWin: boolean, freeSpins: any) {
        const delayTime =
            betWin > 0 && !bigWin ? this.main.slotGameConfigs.showWinningLineDuration : this.main.slotGameConfigs.noWinningLineDuration;
        this.main.settleTween = cc
            .tween(this.main)
            .call(() => this.showWinningLines(betWin, bigWin, jackpot, winningLines, delayTime))
            .delay(delayTime)
            .call(async () => {
                if (bigWin) {
                    await this.main.showEffectBigWin(betWin);
                }
                if (freeSpins.count > 0) {
                    this.main.updateDisplaySpinButtons();
                    this.main.showHighlightSpecialSymbols(+freeSpins.symbol);
                    await this.main.showEffectFreeSpin();
                } else {
                    this.main.updateDisplayFreeSpinNode();
                }

                this.finishAnimationResult();
                this.checkSpinNextRound(freeSpins);
            })
            .start();
    }

    checkSpinNextRound(freeSpins: any) {
        if (!this.main.gotApiError()) {
            if (freeSpins.count > 0 || (this.main.isAutoSpinMode() && this.main.stillAutoSpin()) || this.main.totalFreeSpins) {
                this.main.spin();
            } else {
                this.main.resetStateButtons();
            }
        }
    }

    async handleBonus(bonus: number) {
        if (bonus) {
            await this.main.showEffectBonus(bonus);
        }
    }
}
