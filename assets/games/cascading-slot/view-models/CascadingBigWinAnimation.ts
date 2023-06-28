import GameUtils from "../../../common/GameUtils";
import { getLanguage, getLocale } from "../../../common/auth/SessionManager";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import { TotalBets } from "../../_new/_base/game-data-management/models/total-bets";
import BigWinAnimation from "../../_slotgame_base/BigWinAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingBigWinAnimation extends BigWinAnimation {
    @property(cc.Sprite)
    frameValueBigWin: cc.Sprite = null;

    @property(cc.Sprite)
    bigWinLevel: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    mainAtlas: cc.SpriteAtlas = null;

    changeFrameForBigWinLevel(betWin: number, totalBet: number) {
        const locale = getLocale();
        console.log("language", getLanguage(locale));
        let level = "big";
        const valueRatio = betWin / totalBet;
        if (valueRatio >= 6) {
            level = "super";
        } else if (valueRatio >= 4) {
            level = "mega";
        }
        this.frameValueBigWin.spriteFrame = this.mainAtlas.getSpriteFrame(`table-number-${level}`);
        this.bigWinLevel.spriteFrame = this.mainAtlas.getSpriteFrame(`text-${level}win-${getLanguage(locale)}`);
    }

    async setAmountSlowHavingSpeed(amount: number, totalBet: number, coinValue: number, onComplete: () => void) {
        await this.floatNumberBigWin({ label: this.amountLabel, amount, totalBet, coinValue });
        onComplete();
    }

    floatNumberBigWin(opt: {
        label: cc.Label;
        amount: number;
        start?: number;
        prefixStr?: string;
        formatNumber?: (value) => string;
        stepValue?: number;
        stepTime?: number;
        totalBet?: number;
        coinValue?: number;
    }) {
        return new Promise<void>((resolve) => {
            const { label, amount: end, start, totalBet, coinValue } = opt;
            const prefixStr = opt.prefixStr ?? "";
            const defaultFormater = (v) => numberWithCommas(v, 2, false);
            const formatNumber = opt.formatNumber ?? defaultFormater;
            const stepValueTmp = opt.stepValue ?? 0.01;
            const stepValue = coinValue;
            const stepTime = opt.stepTime ?? 0.05;
            const startStr = label.string.replace(prefixStr, "");
            const startValue = start || parseFloat(startStr.replace(/,/g, "")) || 0;
            const range = Math.abs(end - startValue);

            if (!range) {
                resolve();
                return;
            }

            const repeatCount = Math.floor(range / stepValue);

            let value = startValue;
            label.node.stopAllActions();
            const formatText = (value) => prefixStr + formatNumber(value);
            cc.tween(label.node)
                .repeat(
                    repeatCount,
                    cc
                        .tween(label.node)
                        .call(() => {
                            label.string = formatText(value);
                            value += stepValue;

                            this.changeFrameForBigWinLevel(value, totalBet);
                        })
                        .delay(stepTime)
                )
                .call(() => {
                    label.string = formatText(end);
                    resolve();
                })
                .start();
        });
    }

    private addSpeedLevel(isCheckSpeed: boolean, amount: number, stepValue: number) {
        if (!isCheckSpeed) {
            return stepValue;
        }

        if (amount < 10) {
            return 0.01;
        }
        if (amount < 500) {
            return 0.11;
        }

        return 1.11;
    }
}
