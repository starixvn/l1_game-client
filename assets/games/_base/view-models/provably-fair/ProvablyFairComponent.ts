import GameUtils from "../../../../common/GameUtils";
import CommonDialog from "../../../../common/_base/view-models/CommonDialog";
import { getLanguage, getLocale } from "../../../../common/auth/SessionManager";
import WebViewGuide from "../../../../common/webview-guide/WebViewGuide";
import MiniPanel from "../../../../mini-games-panel/view-models/MiniPanel";

const { ccclass, property } = cc._decorator;

export type ProvablyFairType = {
    hashValue: string;
    clientSeed?: number;
};

@ccclass
export default class ProvablyFairComponent extends cc.Component {
    @property(cc.Label)
    clientSeed: cc.Label = null;

    @property(cc.Label)
    serverSeed: cc.Label = null;

    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.Prefab)
    guideProvablyFairPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    clientSeedManualPrefab: cc.Prefab = null;

    @property()
    delayShowServerSeed = 0;

    miniPanel: MiniPanel = null;
    gameId: number;
    currentClientSeed = 0;

    protected serverSeedCopyString = "";
    protected timeout: NodeJS.Timeout;
    protected currentServerSeed = "";
    public nextServerSeed = "";

    callbackHandle() {
        // handle
    }

    onLoad() {
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

    handleReceiveServerSeed(data: ProvablyFairType) {
        if (!this.currentServerSeed.length) {
            this.currentServerSeed = data?.hashValue;
            this.handleServerSeed(data?.hashValue);
            return;
        }

        this.nextServerSeed = data?.hashValue;
    }

    handleServerSeed(hashValue: string) {
        if (!this.node.activeInHierarchy) {
            this.handleProvablyFairData(hashValue);
            return;
        }

        this.timeout = setTimeout(() => {
            this.handleProvablyFairData(hashValue);
        }, this.delayShowServerSeed * 1000);
    }

    protected handleProvablyFairData(hashValue: string) {
        if (this.node?.isValid) {
            this.serverSeed.string = hashValue;
            this.setCopyString(hashValue);
        }
    }

    updateClientSeed(value: string) {
        console.log("updateClientSeed---", value);
        this.clientSeed.string = value.toString();
        this.currentClientSeed = +value;
    }

    protected resetProvablyFair() {
        this.serverSeed.string = "";
        this.setCopyString("");
        this.timeout && clearTimeout(this.timeout);
    }

    protected setCopyString(text: string) {
        this.serverSeedCopyString = text;
    }

    protected setEditBoxLimit() {
        this.clientSeed.string = this.currentClientSeed.toString();
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

    protected changeOpacity(node: cc.Node, isEnable: boolean) {
        node.opacity = isEnable ? 255 : 100;
    }

    onClientSeedClick() {
        // handle
    }

    onCopyHash() {
        GameUtils.copyText(this.serverSeedCopyString);
    }
}
