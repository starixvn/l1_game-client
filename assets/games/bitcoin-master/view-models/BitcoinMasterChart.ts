import { buildUrlWithPath } from "../../../common/helpers/UrlHelper";
import LoadWebView from "../../../common/LoadWebView";

const { ccclass } = cc._decorator;

@ccclass
export default class BitcoinMasterChart extends LoadWebView {
    initURL(sessionID: string) {
        this.url = buildUrlWithPath(`/bitcoinmaster/chart.html?ss=${sessionID}`);
        console.log("url chart ", this.url);
    }
}
