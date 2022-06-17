import * as i18n from "i18n/runtime-scripts/LanguageData";

import AudioManager from "../../common/audio/AudioManager";
import MusicPlayer from "../../common/audio/MusicPlayer";
import CallbackAnimation from "../../common/CallbackAnimation";
import NewGameRoomBase from "../_new/_base/NewGameRoomBase";
import FeatureSlotGameData from "../cascading-slot/models/FeatureSlotGameData";
import { SpinButtonState } from "../cascading-slot/models/SpinButtonStateModel";
import TurboAutoSpinSettingDialog from "../cascading-slot/view-models/TurboAutoSpinSettingDialog";
import AutoSpinSettingDialog from "./AutoSpinSettingDialog";
import BigWinAnimation from "./BigWinAnimation";
import CountDownWarning from "./CountDownWarning";
import HoldActionButton from "./HoldActionButton";
import SlotGameBottomMessage from "./SlotGameBottomMessage";
import SlotGameSound from "./SlotGameSound";
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

    @property(cc.Node)
    defaultMiniMenu: cc.Node = null;

    countDownAutoSpin: CountDownWarning = null;
    bottomMessage: SlotGameBottomMessage = null;
    gameSound: SlotGameSound;
    protected autoSpinCount = 0;
    protected lastAutoSpinCount: number;
    protected totalFreeSpins = 0;
    protected cacheApiError: any = null;

    public gameData: FeatureSlotGameData<void>;

    abstract getCurrentTotalBet(): number;
    abstract spin(): boolean;
    abstract setAllowChangeBet(allow: boolean);
    abstract getCustomDuration(type: string): number;

    onLoad() {
        super.onLoad();
        const audioManager = AudioManager.getInstance();
        this.playMusicBackground(audioManager.musicEnabled);
        audioManager.addMusicChanged(`${this.gameId}`, this.playMusicBackground.bind(this));
    }

    start() {
        this.schedule(this.setDefaultPositionForMiniMenu, 0.1);
    }

    onDestroy() {
        super.onDestroy();
        const audioManager = AudioManager.getInstance();
        audioManager.removeMusicChanged(`${this.gameId}`);
    }

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

        this.updateBottomMessageStatus();
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
        this.updateBottomMessageStatus();
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

    createAutoSpinCountDown(autoSpinCount: number) {
        const onFinished = () => this.spin();
        const checkCancel = () => !this.isAutoSpinMode();
        const onCancel = () => this.gameData.spinButtonStateModel.change(SpinButtonState.Normal);
        this.countDownAutoSpin.show(autoSpinCount, onFinished, checkCancel, onCancel);
    }

    createAutoSpinDialog(): AutoSpinSettingDialog {
        const node = cc.instantiate(this.autoSpinDialogPrefab);
        this.currentMiniPanel.addDialog(node);
        const dialog = node.getComponent(AutoSpinSettingDialog);
        dialog.onConfirmCallback = (autoSpinCount: number) => {
            this.setAutoSpinCount(autoSpinCount);
            this.lastAutoSpinCount = autoSpinCount;
            this.gameData.spinButtonStateModel.change(SpinButtonState.AutoSpin);

            this.spin();
        };
        if (this.lastAutoSpinCount) {
            dialog.setLastSelected(this.lastAutoSpinCount);
        }

        const turboDialog = node.getComponent(TurboAutoSpinSettingDialog);
        if (turboDialog) {
            turboDialog.syncTurboToggle(this.turboToggle.isChecked);
            turboDialog.turboChangedCallback = (value: boolean) => (this.turboToggle.isChecked = value);
        }

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
        this.bottomMessage.autoSpinCount = count;
    }

    updateBottomMessageStatus() {
        this.bottomMessage.isTurboAutoSpin = this.isAutoSpinMode();
    }

    showEffect(effect: cc.Node): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.effectContainer.addChild(effect);

            const animation = effect.getComponent(CallbackAnimation);
            animation.onFinishedCallback = () => resolve();
            animation.play();
        });
    }

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

    setDefaultPositionForMiniMenu() {
        const wPosition = this.defaultMiniMenu.convertToWorldSpaceAR(cc.v2(0, 0));
        const localPosition = this.currentMiniPanel.miniMenu.parent.convertToNodeSpaceAR(wPosition);
        this.currentMiniPanel.miniMenu.position = cc.v3(this.currentMiniPanel.miniMenu.position.x, localPosition.y);
    }

    playMusicBgCallback() {
        this.musicBg.play();
    }

    playMusicBackground(play: boolean) {
        const musicPlayer = MusicPlayer.getInstance();
        if (play) {
            if (musicPlayer.isPlayBgMusic) {
                this.scheduleOnce(this.playMusicBgCallback, MusicPlayer.getInstance().delayTurnOffMusicBg);
            } else {
                this.playMusicBgCallback();
            }
        } else {
            this.unschedule(this.playMusicBgCallback);
            this.musicBg?.stop();
        }
    }

    initShowBottomMessage(node: cc.Node) {
        this.bottomMessage = node.getComponent(SlotGameBottomMessage);
    }

    onSoundListInitialized(node: cc.Node) {
        this.gameSound = node.getComponent(SlotGameSound);
    }
}
