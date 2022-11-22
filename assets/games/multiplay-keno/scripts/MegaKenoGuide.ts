import WebViewGuide from "../../../common/webview-guide/WebViewGuide";
import AudioManager from "../../../common/audio/AudioManager";
import { MegaKeno1Id } from "./MegaKenoConfig";
import { getLanguage, getLocale } from "../../../common/auth/SessionManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MegaKenoGuide extends cc.Component {
    @property(WebViewGuide)
    content: WebViewGuide = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    public games = {};

    onLoad() {
        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
    }

    start() {
        this.select(MegaKeno1Id);
    }

    selectGame(event, game) {
        this.select(game);
    }

    select(gameId: number) {
        AudioManager.getInstance().playClick();
        const game = this.games[gameId];
        const { minBet, maxBet } = game.getBetRange();
        const locale = getLocale();
        const language = getLanguage(locale !== "vi-VN" && locale !== "en-US" ? "en-US" : locale);
        this.content.initURL(
            gameId,
            language,
            { minBet, maxBet, used: game.isUsingMaxStakeLevel() },
            false,
            cc.RedT.user?.fractionalOddsFormat
        );
        this.content.sendDataToIframe(game.gameConfigs);
        this.content.loadWebView();
    }
}
