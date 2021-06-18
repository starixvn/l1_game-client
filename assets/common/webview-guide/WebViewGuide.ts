import CommonDialog from "../../common/_base/view-models/CommonDialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WebViewGuide extends cc.Component {
    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.WebView)
    webView: cc.WebView = null;

    protected url: string;
    onLoad() {
        this.commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    initURL(gameId: number, minBet: number, maxBet: number, locale: string) {
        const url = `https://l1-guide.lumigame.com/?gId=${gameId}&lang=${locale}&t=blue&minBet=${minBet}&maxBet=${maxBet}1000`;
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
