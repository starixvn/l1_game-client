import * as i18n from "i18n/runtime-scripts/LanguageData";

import AudioManager from "../../common/audio/AudioManager";
import CallbackAnimation from "../../common/CallbackAnimation";
import NewGameRoomBase from "../_new/_base/NewGameRoomBase";
import FeatureSlotGameData from "../cascading-slot/models/FeatureSlotGameData";
import { SpinButtonState } from "../cascading-slot/models/SpinButtonStateModel";
import AutoSpinSettingDialog from "./AutoSpinSettingDialog";
import BigWinAnimation from "./BigWinAnimation";
import CountDownWarning from "./CountDownWarning";
import HoldActionButton from "./HoldActionButton";
import SpinButton from "./SpinButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class FeatureSlotGameBase extends NewGameRoomBase {
    @property(cc.Toggle)
    autoSpinToggle: cc.Toggle = null;

    @property(cc.Toggle)
    turboToggle: cc.Toggle = null;

    @property(cc.Prefab)
    autoSpinDialogPrefab: cc.Prefab = null;

    @property(SpinButton)
    spinButton: SpinButton = null;

    @property(cc.Node)
    effectContainer: cc.Node = null;

    @property(cc.Prefab)
    effectBigWin: cc.Prefab = null;

    @property(cc.Prefab)
    effectFreeSpin: cc.Prefab = null;

    @property(HoldActionButton)
    holdActionButton: HoldActionButton = null;

    countDownAutoSpin: CountDownWarning = null;

    protected autoSpinCount = 0;
    protected totalFreeSpins = 0;
    private cacheApiError: any = null;

    abstract getCurrentTotalBet(): number;
    abstract spin(): boolean;

    public gameData: FeatureSlotGameData<void>;

    onTurboModeChanged(toggle: cc.Toggle) {
        AudioManager.getInstance().playClick();

        const turboWarningName = "turbo_warning";
        this.noticeNode.children.forEach((child) => {
            if (child.name === turboWarningName) {
                child.destroy();
            }
        });

        const key = toggle.isChecked ? "enableTurboMode" : "disableTurboMode";
        const message = i18n.t(`messages.${key}`);
        const notice = this.showMiniWarning(message);
        notice.name = turboWarningName;
    }

    onAutoSpinChanged() {
        AudioManager.getInstance().playClick();

        if (!this.isAutoSpinMode() || !this.checkAvailableBalance()) {
            this.setAutoSpinCount(0);
            this.gameData.spinButtonStateModel.change(SpinButtonState.Normal);

            return;
        }

        if (!this.isFreeSpin()) {
            this.createAutoSpinDialog();
            this.setAllowChangeBet(false);
        }
    }

    onAutoSpinOff() {
        this.autoSpinToggle.isChecked = false;
        this.setAutoSpinCount(0);
        // if (this.holdActionButton.isAutoAction) {
        //     this.setAllowChangeBet(false);
        //     this.autoSpinToggle.interactable = false;
        // } else {
        //     this.setAllowChangeBet(true);
        //     this.autoSpinToggle.interactable = true;
        // }
        this.gameData.spinButtonStateModel.change(SpinButtonState.Normal);
    }

    checkAvailableBalance(): boolean {
        const total = this.getCurrentTotalBet();
        if (this.getUserBalance() < total) {
            this.showMiniWarning(i18n.t("messages.notEnoughMoney"));
            return false;
        }
        return true;
    }

    createAutoSpinDialog(): AutoSpinSettingDialog {
        const node = cc.instantiate(this.autoSpinDialogPrefab);
        this.currentMiniPanel.addDialog(node);
        const dialog = node.getComponent(AutoSpinSettingDialog);
        dialog.onConfirmCallback = (autoSpinCount: number) => {
            this.setAutoSpinCount(autoSpinCount);
            this.gameData.spinButtonStateModel.change(SpinButtonState.AutoSpin);

            const onFinished = () => this.spin();
            const checkCancel = () => !this.isAutoSpinMode();
            const onCancel = () => this.gameData.spinButtonStateModel.change(SpinButtonState.Normal);
            this.countDownAutoSpin.show(autoSpinCount, onFinished, checkCancel, onCancel);
        };

        dialog.onCancelCallback = () => this.onAutoSpinOff();
        return dialog;
    }

    isAutoSpinMode() {
        return this.autoSpinToggle.isChecked;
    }

    isTurboMode(): boolean {
        return this.turboToggle.isChecked;
    }

    isFreeSpin(): boolean {
        return this.totalFreeSpins > 0;
    }

    stillAutoSpin() {
        return this.autoSpinCount > 0;
    }

    consumeAutoSpinCount() {
        if (this.autoSpinCount > 0) {
            this.setAutoSpinCount(this.autoSpinCount - 1);
        }
    }

    setAutoSpinCount(count: number) {
        this.autoSpinCount = count;
        this.spinButton.setAutoSpinCount(count);
    }

    showEffect(effect: cc.Node): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.effectContainer.addChild(effect);

            const animation = effect.getComponent(CallbackAnimation);
            animation.onFinishedCallback = () => resolve();
            animation.play();
        });
    }

    abstract getCustomDuration(type: string): number;

    async showEffectBigWin(betWin: number) {
        const effect = cc.instantiate(this.effectBigWin);
        const callbackAnim = effect.getComponent(CallbackAnimation);
        callbackAnim.setDuration(this.getCustomDuration("bigWin"));
        const bigWinAnimation = effect.getComponent(BigWinAnimation);
        const floatNumberDuration = this.getCustomDuration("bigWinFloatNumber");
        bigWinAnimation.setAmount(betWin, floatNumberDuration);
        await this.showEffect(effect);
    }

    async showEffectFreeSpins(count: number) {
        const effect = cc.instantiate(this.effectFreeSpin);
        const callbackAnim = effect.getComponent(CallbackAnimation);
        callbackAnim.setDuration(this.getCustomDuration("freeSpin"));
        const bigWinAnimation = effect.getComponent(BigWinAnimation);
        bigWinAnimation.setAmount(count);
        await this.showEffect(effect);
    }

    showNoticeForCacheApiError() {
        if (this.cacheApiError) {
            const error = this.cacheApiError;
            this.currentMiniPanel.showErrorNotice(error);
            this.cacheApiError = null;

            return true;
        }
        return false;
    }

    initCountDownWarning(node: cc.Node) {
        this.countDownAutoSpin = node.getComponent(CountDownWarning);
        this.countDownAutoSpin.node.active = false;
    }

    abstract setAllowChangeBet(allow: boolean);
}
