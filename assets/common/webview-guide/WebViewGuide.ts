import CommonDialog from "../../common/_base/view-models/CommonDialog";
import * as config from "../../configs/Configs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WebViewGuide extends cc.Component {
    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.WebView)
    webView: cc.WebView = null;

    protected url: string;

    onLoad() {
        if (this.commonDialog) {
            this.commonDialog.onDidHide = () => {
                this.node.destroy();
            };
        }
    }

    initURL(gameId: number, minBet: number, maxBet: number, locale: string) {
        const domain = config.guideDomain;
        const url = `${domain}/?gId=${gameId}&lang=${locale}&t=blue&minBet=${minBet}&maxBet=${maxBet}`;
        this.url = url;
    }

    setURL(url: string) {
        const domain = config.guideDomain;
        this.url = `${domain}${url}`;
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
