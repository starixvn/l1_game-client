import GameUtils from "../../../common/GameUtils";
import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import { getLanguage, getLocale } from "../../../common/auth/SessionManager";
import WebViewGuide from "../../../common/webview-guide/WebViewGuide";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";

const { ccclass, property } = cc._decorator;

export type ProvablyFairType = {
    hashValue: string;
    clientSeed?: number;
};

@ccclass
export default class ProvablyFairComponent extends cc.Component {
    @property(cc.EditBox)
    clientSeed: cc.EditBox = null;

    @property(cc.Node)
    tooltip: cc.Node = null;

    @property(cc.RichText)
    serverSeed: cc.RichText = null;

    @property(cc.Node)
    hintCopyNode: cc.Node = null;

    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.Prefab)
    guideProvablyFairPrefab: cc.Prefab = null;

    @property(cc.Button)
    btnClientSeedNext: cc.Button = null;

    @property(cc.Button)
    btnClientSeedPrev: cc.Button = null;

    @property()
    clientSeedMin = 0;

    @property()
    clientSeedMax = 103;

    @property()
    delayShowHashValue = 1.35;

    miniPanel: MiniPanel = null;
    gameId: number;
    currentClientSeed = 0;

    protected serverSeedCopyString = "";
    protected timeout: NodeJS.Timeout;

    callbackHandle() {
        // handle
    }

    onLoad() {
        this.setRandomClientSeed();
        this.commonDialog.addOnDidHide(() => {
            this.statusNode(false);
        });
    }

    onShow() {
        this.statusNode(true);
        this.commonDialog.showDialog();
    }

    onHide() {
        this.commonDialog.closeDialogWithoutAnim();
        this.statusNode(false);
    }

    statusNode(active: boolean) {
        this.node.active = active;
    }

    onClickDecrementClientSeed() {
        if (this.currentClientSeed === this.clientSeedMin) {
            this.currentClientSeed = this.clientSeedMax;
        } else {
            this.currentClientSeed = (this.currentClientSeed - 1 + this.clientSeedMax) % this.clientSeedMax;
        }

        this.setEditBoxLimit();
    }

    onClickIncreaseClientSeed() {
        if (this.currentClientSeed === this.clientSeedMax) {
            this.currentClientSeed = this.clientSeedMin;
        } else {
            this.currentClientSeed = (this.currentClientSeed + 1) % this.clientSeedMax;
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
        GameUtils.copyText(this.serverSeedCopyString);
    }

    protected showHintHash() {
        cc.tween(this.hintCopyNode).to(0.2, { opacity: 255 }).delay(1).to(0.1, { opacity: 0 }).start();
    }

    updateProvablyFairString(data: ProvablyFairType) {
        if (!this.node.activeInHierarchy) {
            this.handleProvablyFairData(data);
            return;
        }

        this.timeout = setTimeout(() => {
            this.handleProvablyFairData(data);
        }, this.delayShowHashValue * 1000);
    }

    protected handleProvablyFairData(data: ProvablyFairType) {
        if (this.node?.isValid) {
            this.serverSeed.string = data?.hashValue;
            this.setCopyString(data?.hashValue);
        }
    }

    updateClientSeed(value: string) {
        this.clientSeed.string = value;
    }

    protected resetProvablyFair() {
        this.serverSeed.string = "";
        this.setCopyString("");
        this.timeout && clearTimeout(this.timeout);
    }

    protected setCopyString(text: string) {
        this.serverSeedCopyString = text;
    }

    onChangeInputLimit(value: string) {
        console.log(value);
        let currentValue = +value;
        if (currentValue > 103) {
            currentValue = 103;
        } else if (currentValue < 0) {
            currentValue = 0;
        }

        this.currentClientSeed = currentValue;
        this.setEditBoxLimit();
    }

    protected setEditBoxLimit() {
        this.clientSeed.string = this.currentClientSeed.toString();
    }

    onClickRandomClientSeed() {
        const value = Math.floor(Math.random() * (this.clientSeedMax - this.clientSeedMin + 1)) + this.clientSeedMin;
        this.currentClientSeed = value;
        this.setEditBoxLimit();
    }

    onCloseClick() {
        this.commonDialog.closeDialog();
    }

    onGuideClick() {
        const dialog = cc.instantiate(this.guideProvablyFairPrefab);
        const locale = getLocale();
        const language = getLanguage(locale);
        const guide = dialog.getComponent(WebViewGuide);
        guide.setURL(`/${language}/?gameId=${this.gameId}&PF=1&t=blue&c=0&f=sc&v=${Date.now()}`);
        this.miniPanel.addDialog(dialog);
        guide.loadWebView();
    }

    private getRandomClientSeed() {
        return Math.floor(Math.random() * (this.clientSeedMax - this.clientSeedMin + 1)) + this.clientSeedMin;
    }

    setClientSeedUIState(isEnable: boolean) {
        this.btnClientSeedNext.interactable = isEnable;
        this.changeOpacity(this.btnClientSeedNext.node, isEnable);
        this.btnClientSeedPrev.interactable = isEnable;
        this.changeOpacity(this.btnClientSeedPrev.node, isEnable);
        this.clientSeed.enabled = isEnable;
    }

    protected changeOpacity(node: cc.Node, isEnable: boolean) {
        node.opacity = isEnable ? 255 : 100;
    }

    setRandomClientSeed() {
        this.currentClientSeed = this.getRandomClientSeed();
        this.clientSeed.string = this.currentClientSeed.toString();
    }
}
