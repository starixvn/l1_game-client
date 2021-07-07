import CommonDialog from "../../common/_base/view-models/CommonDialog";
import { ComponentSystem, ICashSystem, ICreditSystem } from "../../System";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WebViewGuide extends ComponentSystem implements ICreditSystem, ICashSystem {
    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.WebView)
    webView: cc.WebView = null;

    protected url: string;
    private domain: string;
    onLoad() {
        if (this.commonDialog) {
            this.commonDialog.onDidHide = () => {
                this.node.destroy();
            };
        }
    }

    customizeCredit(): void {
        this.domain = "https://l1-guide.lumigame.com";
    }

    customizeCash(): void {
        this.domain = "https://l2-guide.lumigame.com";
    }

    initURL(gameId: number, minBet: number, maxBet: number, locale: string) {
        const url = `${this.domain}/?gId=${gameId}&lang=${locale}&t=blue&minBet=${minBet}&maxBet=${maxBet}`;
        this.url = url;
    }

    setURL(url: string) {
        this.url = url;
    }

    loadWebView() {
        if (this.url) {
            this.webView.url = this.url;
        }
    }

    onEnable() {
        cc.tween(this.node)
            .delay(0.3)
            .call(() => this.loadWebView())
            .start();
    }
}
