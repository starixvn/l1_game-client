import LoadWebView from "../../../common/LoadWebView";
import * as config from "../../../configs/Configs";
const { ccclass } = cc._decorator;

@ccclass
export default class BitcoinMasterChart extends LoadWebView {
    initURL(sessionID: string) {
        const domain = config.domain;
        let url = `${domain}/bitcoinmaster/chart.html?ss=${sessionID}`;
        this.url = url;
    }
}
