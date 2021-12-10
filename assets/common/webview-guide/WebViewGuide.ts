import CommonDialog from "../../common/_base/view-models/CommonDialog";
import * as config from "../../configs/Configs";
import LoadWebView from "../LoadWebView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WebViewGuide extends LoadWebView {
    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property()
    themeName = "blue";

    onLoad() {
        super.onLoad();
        if (this.commonDialog) {
            this.commonDialog.addOnDidHide(() => {
                this.node.destroy();
            });
        }
    }

    initURL(gameId: number, language: string, configStake: { minBet: number; maxBet: number; used: boolean }) {
        const domain = config.guideDomain;
        let url = `${domain}/${language}?gId=${gameId}&t=${this.themeName}&f=c&v=${Date.now()}`;
        url += `&minBet=${configStake.minBet}&maxBet=${configStake.maxBet}`;
        this.url = url;
    }

    setURL(url: string) {
        const domain = config.guideDomain;
        this.url = `${domain}${url}`;
    }

    loadWebView() {
        if (this.url) {
            this.showLoading();
            this.hideWebView();

            this.webView.url = this.url;
        }
    }
}
