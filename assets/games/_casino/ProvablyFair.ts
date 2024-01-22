import EffectAppearanceLabel from "../../common/EffectAppearanceLabel";
import GameUtils from "../../common/GameUtils";
import CommonDialog from "../../common/_base/view-models/CommonDialog";
import { getLanguage, getLocale } from "../../common/auth/SessionManager";
import WebViewGuide from "../../common/webview-guide/WebViewGuide";
import MiniPanel from "../../mini-games-panel/view-models/MiniPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ProvablyFair extends cc.Component {
    @property(cc.EditBox)
    editBoxLimit: cc.EditBox = null;

    @property(cc.Node)
    tooltip: cc.Node = null;

    @property(EffectAppearanceLabel)
    hashValue: EffectAppearanceLabel = null;

    @property(cc.Node)
    hintCopyNode: cc.Node = null;

    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.Prefab)
    gamGuidePrefab: cc.Prefab = null;

    @property()
    clientSeedMin = 0;

    @property()
    clientSeedMax = 103;

    clientSeed = 0;
    defaultLimit = 5;
    hashCopyString = "";

    public currentMiniPanel: MiniPanel;
    gameId: number;

    callbackHandle() {
        // handle
    }

    callBackOpenGuide() {
        // handle
    }

    initGameGuide(currentMiniPanel: MiniPanel, gameId: number) {
        this.currentMiniPanel = currentMiniPanel;
        this.gameId = gameId;
    }

    onLoad() {
        this.editBoxLimit.string = this.defaultLimit.toString();
        this.clientSeed = this.defaultLimit;
        this.setCopyString("test12312asasd");
    }

    onLimitPrevClick() {
        if (this.clientSeed === this.clientSeedMin) {
            this.clientSeed = this.clientSeedMax;
        } else {
            this.clientSeed = (this.clientSeed - 1 + this.clientSeedMax) % this.clientSeedMax;
        }

        this.setEditBoxLimit();
    }

    onLimitNextClick() {
        if (this.clientSeed === this.clientSeedMax) {
            this.clientSeed = this.clientSeedMin;
        } else {
            this.clientSeed = (this.clientSeed + 1) % this.clientSeedMax;
        }
        this.setEditBoxLimit();
    }

    onInfoClick() {
        const currentState = !this.tooltip.active;
        const targetScale = currentState ? 1 : 0;
        const targetOpacity = currentState ? 255 : 0;

        cc.tween(this.tooltip)
            .to(
                0.2,
                { scale: targetScale, opacity: targetOpacity },
                {
                    easing: currentState ? "backIn" : "backOut"
                }
            )
            .call(() => {
                this.tooltip.active = currentState;
            })
            .start();
    }

    onCopyHash() {
        this.showHintHash();
        GameUtils.copyText(this.hashCopyString);
    }

    showHintHash() {
        cc.tween(this.hintCopyNode).to(0.2, { opacity: 255 }).delay(1).to(0.1, { opacity: 0 }).start();
    }

    setCopyString(text: string) {
        this.hashCopyString = text;
        this.hashValue.string = text;
    }

    onChangeInputLimit(value: string) {
        console.log(value);
        let currentValue = +value;
        if (currentValue > 103) {
            currentValue = 103;
        } else if (currentValue < 0) {
            currentValue = 0;
        }

        this.clientSeed = currentValue;
        this.setEditBoxLimit();
    }

    setEditBoxLimit() {
        this.editBoxLimit.string = this.clientSeed.toString();
    }

    onClickRandomClientSeed() {
        const value = Math.floor(Math.random() * (this.clientSeedMax - this.clientSeedMin + 1)) + this.clientSeedMin;
        this.clientSeed = value;
        this.setEditBoxLimit();
    }

    onCloseClick() {
        this.commonDialog.closeDialog();
        this.callbackHandle();
    }

    onGuideClick() {
        // handle
        const dialog = cc.instantiate(this.gamGuidePrefab);
        const locale = getLocale();
        const language = getLanguage(locale);
        const guide = dialog.getComponent(WebViewGuide);
        guide.setURL(`/${language}/?gameId=${this.gameId}&PF=1&t=blue&c=0&f=sc&v=${Date.now()}`);
        this.currentMiniPanel.addDialog(dialog);
        guide.loadWebView();
    }
}
