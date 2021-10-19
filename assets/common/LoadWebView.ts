import CommonDialog from "../common/_base/view-models/CommonDialog";
import * as config from "../configs/Configs";
import CustomWebView from "./CustomWebView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WebViewGuide extends cc.Component {
    @property(CustomWebView)
    webView: CustomWebView = null;

    @property(cc.Node)
    loading: cc.Node = null;

    protected url: string;

    onLoad() {
        this.webView.node.on(
            "loaded",
            () => {
                const paddingTime = 0.3;
                cc.tween(this.node)
                    .delay(paddingTime)
                    .call(() => {
                        this.hideLoading();
                        this.showWebView();
                    })
                    .start();
            },
            this
        );
    }

    showWebView() {
        this.webView.setOpacity(255);
    }

    hideWebView() {
        this.webView.setOpacity(0);
    }

    showLoading() {
        this.loading.active = true;
    }

    hideLoading() {
        this.loading.active = false;
    }

    loadWebView() {
        if (this.url) {
            this.showLoading();
            this.hideWebView();

            this.webView.url = this.url;
        }
    }
}
