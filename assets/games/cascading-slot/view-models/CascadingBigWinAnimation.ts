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

    @property(sp.Skeleton)
    coinLoopSpine: sp.Skeleton = null;

    private isChangeLevelSuper = true;
    private isChangeLevelMega = true;

    changeFrameForBigWinLevel(betWin: number, totalBet: number) {
        const locale = getLocale();
        let level = "big";
        const valueRatio = betWin / totalBet;
        if (valueRatio >= 6) {
            level = "super";
            this.isChangeLevelSuper && this.setAniamtionChangeSuper(this.bigWinLevel.node);
        } else if (valueRatio >= 4) {
            level = "mega";
            this.isChangeLevelMega && this.setAniamtionChangeMega(this.bigWinLevel.node);
        }
        this.frameValueBigWin.spriteFrame = this.mainAtlas.getSpriteFrame(`table-number-${level}`);
        this.bigWinLevel.spriteFrame = this.mainAtlas.getSpriteFrame(`text-${level}win-${getLanguage(locale)}`);
    }

    animChangeTextLevel(node: cc.Node) {
        cc.tween(node)
            .to(0.1, { opacity: 0, scale: 0 }, { easing: "sineInOut" })
            .to(0.1, { opacity: 255, scale: 1 }, { easing: "sineInOut" })
            .start();
    }

    setAniamtionChangeSuper(node: cc.Node) {
        this.animChangeTextLevel(node);
        this.isChangeLevelSuper = false;
        this.coinLoopSpine.timeScale = 1.8;
    }

    setAniamtionChangeMega(node: cc.Node) {
        this.animChangeTextLevel(node);
        this.isChangeLevelMega = false;
        this.coinLoopSpine.timeScale = 1.4;
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
            let stepValue = coinValue;
            if (coinValue <= 0.05) {
                stepValue = 0.01;
            } else if (coinValue <= 0.5) {
                stepValue = 0.1;
            }
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
