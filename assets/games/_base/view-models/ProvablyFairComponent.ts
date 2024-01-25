import GameUtils from "../../../common/GameUtils";
import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import { getLanguage, getLocale } from "../../../common/auth/SessionManager";
import WebViewGuide from "../../../common/webview-guide/WebViewGuide";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";

const { ccclass, property } = cc._decorator;

export type ProvablyFairType = {
    hashValue: string;
};

@ccclass
export default class ProvablyFairComponent extends cc.Component {
    @property(cc.EditBox)
    editBoxLimit: cc.EditBox = null;

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

    @property()
    clientSeedMin = 0;

    @property()
    clientSeedMax = 103;

    @property
    lengthOfPF = 21;

    @property(cc.RichText)
    richText: cc.RichText = null;

    miniPanel: MiniPanel = null;
    gameId: number;
    clientSeed = 0;

    protected serverSeedCopyString = "";
    readonly delayShowHashValue: number = 1.35;
    protected timeout: NodeJS.Timeout;

    callbackHandle() {
        // handle
    }

    onLoad() {
        this.clientSeed = this.getRandomClientSeed();
        this.editBoxLimit.string = this.clientSeed.toString();
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
        GameUtils.copyText(this.serverSeedCopyString);
    }

    showHintHash() {
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

    handleProvablyFairData(data: ProvablyFairType) {
        if (this.node?.isValid) {
            this.generateMD5Result(data?.hashValue);
            this.setCopyString(data?.hashValue);
        }
    }

    generateMD5Result(value: string) {
        this.serverSeed.string = value;
    }

    resetProvablyFair() {
        this.serverSeed.string = "";
        this.setCopyString("");
        this.timeout && clearTimeout(this.timeout);
    }

    setCopyString(text: string) {
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

    getRandomClientSeed() {
        return Math.floor(Math.random() * (this.clientSeedMax - this.clientSeedMin + 1)) + this.clientSeedMin;
    }
}
