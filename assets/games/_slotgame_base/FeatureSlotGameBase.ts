import * as i18n from "i18n/runtime-scripts/LanguageData";

import AudioManager from "../../common/audio/AudioManager";
import NewGameRoomBase from "../_new/_base/NewGameRoomBase";
import AutoSpinSettingDialog from "./AutoSpinSettingDialog";
import CountDownWarning from "./CountDownWarning";
import SpinButton from "./SpinButton";

export enum RoundType {
    BEFORESPIN = 0,
    SPINNING = 1,
    SETTLED = 2
}

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class FeatureSlotGameBase extends NewGameRoomBase {
    @property(cc.Toggle)
    autoSpinToggle: cc.Toggle = null;

    @property(cc.Toggle)
    turboToggle: cc.Toggle = null;

    @property(cc.Prefab)
    autoSpinDialogPrefab: cc.Prefab = null;

    @property(CountDownWarning)
    countDownAutoSpin: CountDownWarning = null;

    @property(SpinButton)
    spinButton: SpinButton = null;

    @property(cc.Label)
    messageText: cc.Label = null;

    private autoSpinCount = 0;

    abstract getCurrentTotalBet(): number;
    abstract spin(): boolean;

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

        if (!this.checkAvailableBalance()) {
            return;
        }

        this.createAutoSpinDialog();
    }

    checkAvailableBalance(): boolean {
        const total = this.getCurrentTotalBet();
        if (cc.RedT.user.red < total) {
            this.showMiniWarning(i18n.t("messages.notEnoughMoney"));
            this.autoSpinToggle.isChecked = false;
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
            this.countDownAutoSpin.show(
                autoSpinCount,
                () => {
                    this.spin();
                },
                () => !this.isAutoSpinMode()
            );
        };

        return dialog;
    }

    isAutoSpinMode() {
        return this.autoSpinToggle.isChecked;
    }

    isTurboMode(): boolean {
        return this.turboToggle.isChecked;
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

    showMessageDisplay(roundType: RoundType) {
        if (!this.messageText) {
            return;
        }
        const msgList = ["showMsgWhenSpin", "roundSettleMsg", "FromSettleToSpin"];
        let msg = `messages.roundSettleMsg`;
        if (roundType === RoundType.BEFORESPIN) {
            if (cc.sys.isMobile) {
                msg = `messages.${msgList[roundType] + "Phone"}`;
            } else {
                msg = `messages.${msgList[roundType] + "Desktop"}`;
            }
        }
        if (roundType === RoundType.SETTLED) {
            const items = this.isTurboMode() ? [1, 2] : [1, 2, 3];
            const item = items[Math.floor(Math.random() * items.length)];
            msg = `messages.FromSettleToSpin${item}`;
        }
        this.messageText.string = `${i18n.t(msg)}`;
    }
}
