import CustomWebView from "./CustomWebView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadWebView extends cc.Component {
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
        this.webView._impl.setVisible(true);
    }

    hideWebView() {
        this.webView._impl.setVisible(false);
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
            // this.hideWebView();

            this.webView.url = this.url;
        }
    }
}
